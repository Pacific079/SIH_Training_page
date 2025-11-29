import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { ComponentState, ComponentType, INITIAL_SUBSTATION_NODES, SCENARIOS } from './constants.js';

const SimulationContext = createContext(undefined);

export const SimulationProvider = ({ children }) => {
  const [nodes, setNodes] = useState(INITIAL_SUBSTATION_NODES);
  const [logs, setLogs] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [systemHealth, setSystemHealth] = useState(100);
  const [activeLoadMw, setActiveLoadMw] = useState(0);
  const [currentScenarioId, setCurrentScenarioId] = useState(null);

  const nodesRef = useRef(nodes);
  useEffect(() => { nodesRef.current = nodes; }, [nodes]);

  const addLog = useCallback((message, type = 'INFO') => {
    setLogs(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        message,
        type
      }
    ]);
  }, []);

  // --- Power Flow Logic ---
  const updateEnergization = useCallback((currentNodes) => {
    const updated = currentNodes.map(n => {
      const isSource =
        (n.id === 'BUS-A' || n.id === 'BUS-B') &&
        n.state === ComponentState.CLOSED;

      return { ...n, isEnergized: isSource };
    });

    let changed = true;
    let loopCount = 0;

    while (changed && loopCount < 50) {
      changed = false;
      loopCount++;

      for (const node of updated) {
        if (node.isEnergized) {
          for (const neighborId of node.connectedTo) {
            const neighborIndex = updated.findIndex(n => n.id === neighborId);
            if (neighborIndex === -1) continue;

            const neighbor = updated[neighborIndex];
            let canFlow = false;

            if (
              [ComponentType.BREAKER, ComponentType.ISOLATOR, ComponentType.BUSBAR].includes(node.type)
            ) {
              if (node.state === ComponentState.CLOSED) canFlow = true;
            } else if (node.type === ComponentType.LINE) {
              canFlow = true;
            }

            if (canFlow && !neighbor.isEnergized) {
              if (neighbor.state !== ComponentState.OPEN) {
                updated[neighborIndex].isEnergized = true;
                changed = true;
              }
            }
          }
        }
      }
    }

    return updated;
  }, []);

  // --- Component Operation Logic ---
  const operateComponent = (id, command) => {
    const nodeIndex = nodes.findIndex(n => n.id === id);
    if (nodeIndex === -1) return;

    const node = nodes[nodeIndex];

    // Interlocks
    if (node.interlocks) {
      if (node.interlocks.requiredOpen) {
        for (const reqId of node.interlocks.requiredOpen) {
          const reqNode = nodes.find(n => n.id === reqId);
          if (reqNode && reqNode.state !== ComponentState.OPEN) {
            addLog(
              `INTERLOCK ERROR: Cannot operate ${node.name}. ${reqNode.name} must be OPEN first.`,
              'ERROR'
            );
            return;
          }
        }
      }

      if (node.interlocks.requiredClosed) {
        for (const reqId of node.interlocks.requiredClosed) {
          const reqNode = nodes.find(n => n.id === reqId);
          if (reqNode && reqNode.state !== ComponentState.CLOSED) {
            addLog(
              `INTERLOCK ERROR: Cannot operate ${node.name}. ${reqNode.name} must be CLOSED first.`,
              'ERROR'
            );
            return;
          }
        }
      }
    }

    // Isolator Load Break Check
    if (node.type === ComponentType.ISOLATOR && command === 'OPEN' && node.isEnergized) {
      const breaker = nodes.find(
        n => n.type === ComponentType.BREAKER && n.state === ComponentState.CLOSED
      );

      if (
        breaker &&
        (breaker.connectedTo.includes(node.id) ||
          node.connectedTo.includes(breaker.id))
      ) {
        addLog(
          `SAFETY VIOLATION: Attempted to open Isolator on load! Open Circuit Breaker first.`,
          'ERROR'
        );
        setSystemHealth(h => Math.max(0, h - 10));
        return;
      }
    }

    // Perform operation
    const newState = command === 'OPEN' ? ComponentState.OPEN : ComponentState.CLOSED;
    let newNodes = [...nodes];
    newNodes[nodeIndex] = { ...node, state: newState };

    // Trip check
    if (command === 'CLOSE' && node.type === ComponentType.BREAKER) {
      const hasFault = checkDownstreamFault(node, newNodes);

      if (hasFault) {
        addLog(`PROTECTION TRIP: ${node.name} closed onto FAULT!`, 'ERROR');

        setTimeout(() => {
          const trippedNodes = [...nodesRef.current];
          const idx = trippedNodes.findIndex(n => n.id === id);

          if (idx !== -1) {
            trippedNodes[idx].state = ComponentState.TRIPPED;
            setNodes(updateEnergization(trippedNodes));
            addLog(
              `Breaker ${node.id} TRIPPED on Overcurrent/Fault protection.`,
              'WARNING'
            );
          }
        }, 500);

        setNodes(updateEnergization(newNodes));
        return;
      }
    }

    const finalNodes = updateEnergization(newNodes);
    setNodes(finalNodes);
    addLog(`${command} command sent to ${node.name}`, 'SUCCESS');
  };

  const checkDownstreamFault = (breaker, currentNodes) => {
    const line = currentNodes.find(n => n.type === ComponentType.LINE);
    return line && line.isFaulted;
  };

  // --- Scenario Management ---
  const loadScenario = (scenarioId) => {
    const scenario = SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return;

    setCurrentScenarioId(scenarioId);

    let newNodes = JSON.parse(JSON.stringify(INITIAL_SUBSTATION_NODES));

    if (scenario.initialFaults) {
      scenario.initialFaults.forEach(faultId => {
        const n = newNodes.find(node => node.id === faultId);
        if (n) n.isFaulted = true;
      });

      addLog(`Scenario "${scenario.title}" Loaded. System status checked.`, 'INFO');

      if (scenario.initialFaults.length > 0) {
        addLog(`ALARM: Zone protection indicates faults in system.`, 'WARNING');
      }
    } else {
      addLog(`Scenario "${scenario.title}" Loaded. Normal operation.`, 'INFO');
    }

    setNodes(updateEnergization(newNodes));
    setSystemHealth(100);
    setLogs([]);
    addLog(`Begin Operation: ${scenario.description}`, 'INFO');
  };

  const resetSimulation = () => {
    const resetNodes = updateEnergization(INITIAL_SUBSTATION_NODES);
    setNodes(resetNodes);
    setLogs([]);
    setSystemHealth(100);
    setCurrentScenarioId(null);
    addLog('System Reset. Standard operating conditions restored.', 'INFO');
  };

  const injectFault = () => {
    setNodes(prev =>
      prev.map(n => (n.id === 'LINE-1' ? { ...n, isFaulted: true } : n))
    );

    const breaker = nodes.find(n => n.id === 'CB-1');

    if (breaker && breaker.state === ComponentState.CLOSED) {
      operateComponent('CB-1', 'OPEN');
      addLog('FAULT RECORDER: INSTANTANEOUS OVERCURRENT TRIP', 'ERROR');
      setSystemHealth(prev => Math.max(0, prev - 20));
    } else {
      addLog('External Fault detected on Line 1. Breaker was already open.', 'WARNING');
    }
  };

  const selectNode = (id) => {
    setSelectedNodeId(id);
  };

  useEffect(() => {
    setNodes(prev => updateEnergization(prev));
  }, []);

  // Live updates
  useEffect(() => {
    const interval = setInterval(() => {
      const currentNodes = nodesRef.current;
      const linesEnergized = currentNodes.filter(
        n => n.type === ComponentType.LINE && n.isEnergized
      ).length;

      const targetLoad = linesEnergized * 124;

      setActiveLoadMw(prev => {
        const diff = targetLoad - prev;
        return Math.floor(prev + diff * 0.1 + (Math.random() * 4 - 2));
      });

      setNodes(prevNodes =>
        prevNodes.map(n => {
          if (n.isEnergized) {
            const baseVoltage = 400;
            const fluctuation = (Math.random() * 1.5) - 0.75;
            return { ...n, voltageKv: Number((baseVoltage + fluctuation).toFixed(1)) };
          } else {
            return { ...n, voltageKv: 0 };
          }
        })
      );

    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <SimulationContext.Provider
      value={{
        nodes,
        logs,
        selectedNodeId,
        systemHealth,
        activeLoadMw,
        currentScenarioId,
        selectNode,
        operateComponent,
        addLog,
        resetSimulation,
        injectFault,
        loadScenario
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) throw new Error('useSimulation must be used within a SimulationProvider');
  return context;
};

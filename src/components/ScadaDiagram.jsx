import React from "react";
import { useSimulation } from "../context/SimulationContext";

const ScadaDiagram = () => {
  const { nodes, selectNode, selectedNodeId } = useSimulation();

  const getNode = (id) => nodes.find((n) => n.id === id);

  const COLORS = {
    ENERGIZED: "#dc2626",
    DEENERGIZED: "#16a34a",
    DEAD_LINE: "#64748b",
    TRIP: "#d97706",
    TEXT: "#1e293b",
    SELECTED: "#3b82f6",
  };

  // Since TS enums are gone, use plain string matching
  const getColor = (node) => {
    if (!node) return COLORS.DEAD_LINE;
    if (node.state === "TRIPPED") return COLORS.TRIP;
    if (node.state === "CLOSED") return COLORS.ENERGIZED;
    if (node.state === "OPEN") return COLORS.DEENERGIZED;
    return COLORS.DEAD_LINE;
  };

  const getLineColor = (energized) =>
    energized ? COLORS.ENERGIZED : COLORS.DEAD_LINE;

  const Line = ({ from, to, energized }) => (
    <g>
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={getLineColor(energized)}
        strokeWidth="4"
      />
      {energized && (
        <line
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-flow"
        />
      )}
    </g>
  );

  const BreakerIcon = ({ x, y, node }) => {
    const isSelected = selectedNodeId === node.id;
    return (
      <g
        onClick={() => selectNode(node.id)}
        className="cursor-pointer hover:opacity-80 transition-opacity"
      >
        {isSelected && (
          <rect
            x={x - 20}
            y={y - 20}
            width="40"
            height="40"
            fill="none"
            stroke={COLORS.SELECTED}
            strokeWidth="2"
            strokeDasharray="4 2"
            rx="4"
          />
        )}

        <rect
          x={x - 14}
          y={y - 14}
          width="28"
          height="28"
          fill={getColor(node)}
          stroke="#fff"
          strokeWidth="2"
          className="shadow-sm"
        />

        <text
          x={x + 20}
          y={y + 5}
          fill={COLORS.TEXT}
          fontSize="11"
          className="font-mono font-bold"
        >
          {node.id}
        </text>

        <text
          x={x + 20}
          y={y + 18}
          fill={COLORS.DEAD_LINE}
          fontSize="9"
          className="font-mono"
        >
          {node.voltageKv} kV
        </text>
      </g>
    );
  };

  const IsolatorIcon = ({ x, y, node }) => {
    const isSelected = selectedNodeId === node.id;
    return (
      <g
        onClick={() => selectNode(node.id)}
        className="cursor-pointer hover:opacity-80 transition-opacity"
      >
        {isSelected && (
          <circle
            cx={x}
            cy={y}
            r="18"
            fill="none"
            stroke={COLORS.SELECTED}
            strokeWidth="2"
            strokeDasharray="4 2"
          />
        )}

        <circle
          cx={x}
          cy={y}
          r="10"
          stroke={getColor(node)}
          strokeWidth="3"
          fill="white"
        />

        {node.state === "CLOSED" && (
          <line
            x1={x - 7}
            y1={y}
            x2={x + 7}
            y2={y}
            stroke={getColor(node)}
            strokeWidth="3"
          />
        )}

        <text
          x={x + 18}
          y={y + 4}
          fill={COLORS.TEXT}
          fontSize="11"
          className="font-mono font-bold"
        >
          {node.id}
        </text>
      </g>
    );
  };

  const coords = {
    "BUS-A": { x: 100, y: 50 },
    "BUS-B": { x: 100, y: 150 },
    "ISO-A-1": { x: 150, y: 50 },
    "ISO-B-1": { x: 150, y: 150 },
    "CB-1": { x: 250, y: 100 },
    "ISO-L-1": { x: 350, y: 100 },
    "LINE-1": { x: 500, y: 100 },
    "ES-1": { x: 400, y: 140 },
  };

  const busA = getNode("BUS-A");
  const busB = getNode("BUS-B");
  const isoA = getNode("ISO-A-1");
  const isoB = getNode("ISO-B-1");
  const cb1 = getNode("CB-1");
  const isoL = getNode("ISO-L-1");
  const line1 = getNode("LINE-1");
  const es1 = getNode("ES-1");

  return (
    <div className="w-full h-full bg-white rounded-xl border border-scada-border shadow-sm overflow-hidden relative bg-grid-pattern">
      <div className="absolute top-4 left-4 flex flex-col">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Bay Diagram
        </span>
        <span className="text-lg font-bold text-slate-800">
          400kV FEEDER 01
        </span>
      </div>

      <svg width="100%" height="100%" viewBox="0 0 600 300" className="select-none">
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.ENERGIZED} />
          </marker>
        </defs>

        <line
          x1="50"
          y1="50"
          x2="550"
          y2="50"
          stroke={getLineColor(busA?.isEnergized)}
          strokeWidth="10"
          strokeLinecap="round"
        />
        <text x="60" y="40" fill={COLORS.TEXT} fontSize="12" fontWeight="bold">
          BUS A
        </text>

        <line
          x1="50"
          y1="150"
          x2="550"
          y2="150"
          stroke={getLineColor(busB?.isEnergized)}
          strokeWidth="10"
          strokeLinecap="round"
        />
        <text x="60" y="140" fill={COLORS.TEXT} fontSize="12" fontWeight="bold">
          BUS B
        </text>

        <Line from={coords["ISO-A-1"]} to={{ x: 150, y: 100 }} energized={isoA?.isEnergized} />
        <Line from={coords["ISO-B-1"]} to={{ x: 150, y: 100 }} energized={isoB?.isEnergized} />
        <Line
          from={{ x: 150, y: 100 }}
          to={coords["CB-1"]}
          energized={isoA?.isEnergized || isoB?.isEnergized}
        />
        <Line from={coords["CB-1"]} to={coords["ISO-L-1"]} energized={cb1?.isEnergized} />
        <Line from={coords["ISO-L-1"]} to={coords["LINE-1"]} energized={isoL?.isEnergized} />

        <line
          x1={coords["ISO-L-1"].x + 20}
          y1={100}
          x2={400}
          y2={140}
          stroke={es1?.isEnergized ? COLORS.ENERGIZED : "#cbd5e1"}
          strokeWidth="2"
          strokeDasharray="4"
        />

        {isoA && <IsolatorIcon x={coords["ISO-A-1"].x} y={coords["ISO-A-1"].y} node={isoA} />}
        {isoB && <IsolatorIcon x={coords["ISO-B-1"].x} y={coords["ISO-B-1"].y} node={isoB} />}
        {cb1 && <BreakerIcon x={coords["CB-1"].x} y={coords["CB-1"].y} node={cb1} />}
        {isoL && <IsolatorIcon x={coords["ISO-L-1"].x} y={coords["ISO-L-1"].y} node={isoL} />}

        <g transform={`translate(${coords["LINE-1"].x}, ${coords["LINE-1"].y})`}>
          <path
            d="M 0 0 L 40 0"
            stroke={getLineColor(line1?.isEnergized)}
            strokeWidth="4"
            markerEnd="url(#arrow)"
          />
          <text x={5} y={20} fill={COLORS.TEXT} fontSize="12" fontWeight="bold">
            TO GRID
          </text>
          <text x={5} y={32} fill={COLORS.DEAD_LINE} fontSize="10" className="font-mono">
            {line1?.isEnergized ? (Math.random() * 5 + 398).toFixed(1) : "0.0"} kV
          </text>
        </g>

        <g transform={`translate(${coords["ES-1"].x}, ${coords["ES-1"].y})`}>
          <text x={-25} y={-5} fill={COLORS.TEXT} fontSize="10" fontWeight="bold">
            ES-1
          </text>
          <line x1="-10" y1="0" x2="10" y2="0" stroke={COLORS.TEXT} strokeWidth="2" />
          <line x1="-6" y1="4" x2="6" y2="4" stroke={COLORS.TEXT} strokeWidth="2" />
          <line x1="-3" y1="8" x2="3" y2="8" stroke={COLORS.TEXT} strokeWidth="2" />
          <line
            x1="0"
            y1="0"
            x2={es1?.state === "CLOSED" ? 0 : -10}
            y2={-20}
            stroke={es1?.state === "CLOSED" ? COLORS.DEENERGIZED : COLORS.TEXT}
            strokeWidth="2"
          />
          <rect
            x="-20"
            y="-20"
            width="40"
            height="40"
            fill="transparent"
            className="cursor-pointer"
            onClick={() => es1 && selectNode(es1.id)}
          />
        </g>
      </svg>
    </div>
  );
};

export default ScadaDiagram;

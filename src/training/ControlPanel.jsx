import React from 'react';
import { useSimulation } from './SimulationContext.jsx';

const ControlPanel = () => {
  const { nodes, selectedNodeId, operateComponent } = useSimulation();

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <div className="bg-white p-8 rounded-xl border border-scada-border h-full flex flex-col items-center justify-center text-center shadow-sm">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-800">No Selection</h3>
        <p className="text-slate-500 mt-2 text-sm">
          Select a breaker or isolator from the diagram to access controls.
        </p>
      </div>
    );
  }

  const isClosed = selectedNode.state === "CLOSED";
  const isOpen = selectedNode.state === "OPEN";

  return (
    <div className="bg-white p-6 rounded-xl border border-scada-border h-full flex flex-col shadow-sm">
      <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{selectedNode.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-mono border border-slate-200">
              {selectedNode.id}
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
              {selectedNode.type}
            </span>
          </div>
        </div>

        <div
          className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 ${
            isClosed ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isClosed ? 'bg-red-600' : 'bg-green-600'
            }`}
          ></span>
          {selectedNode.state}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => operateComponent(selectedNode.id, 'CLOSE')}
            disabled={isClosed}
            className={`group relative overflow-hidden p-6 rounded-xl font-bold text-lg transition-all border ${
              isClosed
                ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                : 'bg-white text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 shadow-sm hover:shadow-md'
            }`}
          >
            <span className="relative z-10">CLOSE</span>
            {!isClosed && <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500"></div>}
          </button>

          <button
            onClick={() => operateComponent(selectedNode.id, 'OPEN')}
            disabled={isOpen}
            className={`group relative overflow-hidden p-6 rounded-xl font-bold text-lg transition-all border ${
              isOpen
                ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                : 'bg-white text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300 shadow-sm hover:shadow-md'
            }`}
          >
            <span className="relative z-10">OPEN</span>
            {!isOpen && <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500"></div>}
          </button>
        </div>

        <div className="mt-8">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            System Interlocks
          </h4>

          <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-200 space-y-2">
            {!selectedNode.interlocks?.requiredOpen &&
              !selectedNode.interlocks?.requiredClosed && (
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>No active hardware interlocks.</span>
                </div>
              )}

            {selectedNode.interlocks?.requiredOpen?.map(id => (
              <div key={id} className="flex items-center gap-3 text-sm">
                <div className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <span className="text-slate-600">
                  Requires <span className="font-mono font-bold text-slate-800">{id}</span> OPEN
                </span>
              </div>
            ))}

            {selectedNode.interlocks?.requiredClosed?.map(id => (
              <div key={id} className="flex items-center gap-3 text-sm">
                <div className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                </div>
                <span className="text-slate-600">
                  Requires <span className="font-mono font-bold text-slate-800">{id}</span> CLOSED
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;

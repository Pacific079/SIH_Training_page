import React, { useEffect, useRef } from 'react';
import { useSimulation } from './SimulationContext.jsx';

const LogPanel = () => {
  const { logs } = useSimulation();
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className="bg-white border border-scada-border rounded-xl flex flex-col h-full shadow-sm overflow-hidden">
      <div className="bg-slate-50 px-4 py-3 border-b border-scada-border flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Operations Log</h3>

        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-medium text-slate-500">LIVE</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-0 bg-white">
        {logs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
            <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="text-sm">No events recorded</span>
          </div>
        )}

        <ul className="divide-y divide-slate-100">
          {logs.map(log => (
            <li
              key={log.id}
              className="px-4 py-3 hover:bg-slate-50 transition-colors flex gap-3 text-sm"
            >
              <span className="font-mono text-xs text-slate-400 pt-0.5 shrink-0">
                {log.timestamp.toLocaleTimeString([], {
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>

              <div className="flex-1">
                <p
                  className={`font-medium ${
                    log.type === 'ERROR'
                      ? 'text-red-600'
                      : log.type === 'SUCCESS'
                      ? 'text-green-600'
                      : log.type === 'WARNING'
                      ? 'text-amber-600'
                      : 'text-slate-700'
                  }`}
                >
                  {log.message}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default LogPanel;

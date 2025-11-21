import React from 'react';
import ScadaDiagram from '../components/ScadaDiagram';
import ControlPanel from '../components/ControlPanel';
import LogPanel from '../components/LogPanel';
import AiAssistant from '../components/AiAssistant';
import { useSimulation } from '../context/SimulationContext';
import { SCENARIOS } from "../constants";

const SimulationPage = () => {
  const { resetSimulation, injectFault, systemHealth, activeLoadMw, loadScenario, currentScenarioId } = useSimulation();

  return (
    <div className="fixed inset-0 flex flex-col bg-slate-50 text-slate-800 font-sans z-40 overflow-hidden">

      <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 text-white p-1.5 rounded shadow-lg shadow-blue-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">PowerSim</h1>
            <span className="text-xs text-slate-500 font-medium">Engineering Training Environment</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 px-8 border-x border-slate-100">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Grid Load</span>
            <span className="text-lg font-bold text-slate-800 font-mono">{activeLoadMw} MW</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Health</span>
            <span className={`text-lg font-bold font-mono ${systemHealth > 80 ? 'text-green-600' : 'text-red-600'}`}>
              {systemHealth}%
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Frequency</span>
            <span className="text-lg font-bold text-slate-800 font-mono">50.02 Hz</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={currentScenarioId || ""}
              onChange={(e) => {
                if (e.target.value) loadScenario(e.target.value);
                else resetSimulation();
              }}
              className="appearance-none bg-slate-50 border border-slate-200 text-sm font-medium rounded-lg py-2 pl-3 pr-8 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer hover:bg-slate-100"
            >
              <option value="">Manual Mode (Standard)</option>
              {SCENARIOS.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <button
            onClick={injectFault}
            className="px-4 py-2 bg-white text-amber-600 border border-amber-200 hover:bg-amber-50 rounded-lg text-sm font-bold transition-colors shadow-sm"
          >
            Simulate Fault
          </button>

          <button
            onClick={resetSimulation}
            className="px-4 py-2 bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-lg text-sm font-bold transition-colors shadow-sm"
          >
            Reset
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden p-4 gap-4">

        <div className="flex-1 flex flex-col gap-4 min-w-0">

          <div className="flex-1 min-h-0 relative">
            <ScadaDiagram />
          </div>

          <div className="h-40 shrink-0 rounded-xl shadow-sm border border-scada-border bg-white overflow-hidden">
            <AiAssistant />
          </div>
        </div>

        <div className="w-96 flex flex-col shrink-0 gap-4">
          <div className="h-[45%] min-h-[300px]">
            <ControlPanel />
          </div>
          <div className="flex-1 min-h-0">
            <LogPanel />
          </div>
        </div>

      </div>
    </div>
  );
};

export default SimulationPage;

import React, { useState, useEffect } from 'react';
import { useSimulation } from './SimulationContext.jsx';
import { analyzeAction } from './geminiService.js';

const AiAssistant = () => {
  const { logs, nodes } = useSimulation();
  const [feedback, setFeedback] = useState("Ready to analyze your operations.");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const lastLog = logs[logs.length - 1];

    if (lastLog && (lastLog.type === 'SUCCESS' || lastLog.type === 'ERROR')) {
      const fetchAnalysis = async () => {
        setLoading(true);
        setFeedback("Analyzing operation protocols...");

        const result = await analyzeAction(logs, nodes, lastLog.message);
        setFeedback(result);

        setLoading(false);
      };

      fetchAnalysis();
    }
  }, [logs.length]);

  return (
    <div className="bg-white h-full flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-blue-500"></div>

      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex -space-x-1 overflow-hidden">
            <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold">
              AI
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-800">Virtual Instructor</h3>

          {loading && (
            <span className="text-xs text-slate-400 animate-pulse">
              Typing...
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
            {feedback}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;

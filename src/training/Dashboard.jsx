import React, { useEffect, useState } from "react";
import { SCENARIOS } from "./constants.js";
import { generateScenarioDescription } from "./geminiService.js";

const Dashboard = ({ onLaunch }) => {
  const [descriptions, setDescriptions] = useState({});

  useEffect(() => {
    SCENARIOS.forEach(async (scenario) => {
      const desc = await generateScenarioDescription(scenario.title);
      setDescriptions((prev) => ({ ...prev, [scenario.id]: desc }));
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              Simulator Dashboard
            </h1>
            <p className="text-slate-500 text-lg">
              Welcome, Engineer. Select a training module to begin your
              session.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-bold text-slate-900">
                John Doe
              </div>
              <div className="text-xs text-slate-500">
                Senior Grid Operator
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md border-2 border-blue-100">
              JD
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                +2.5%
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">85%</div>
            <div className="text-slate-500 text-sm font-medium">
              Average Assessment Score
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              12h 40m
            </div>
            <div className="text-slate-500 text-sm font-medium">
              Total Simulation Time
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">3</div>
            <div className="text-slate-500 text-sm font-medium">
              Active Certifications
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-200">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </span>
          Training Scenarios
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
          {SCENARIOS.map((scenario) => (
            <div
              key={scenario.id}
              className="group bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg
                  className="w-32 h-32"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border mb-3 ${
                      scenario.difficulty === "Advanced"
                        ? "bg-red-50 text-red-700 border-red-100"
                        : scenario.difficulty === "Intermediate"
                        ? "bg-amber-50 text-amber-700 border-amber-100"
                        : "bg-green-50 text-green-700 border-green-100"
                    }`}
                  >
                    {scenario.difficulty}
                  </span>

                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {scenario.title}
                  </h3>
                </div>
              </div>

              <p className="text-slate-600 mb-6 leading-relaxed relative z-10">
                {scenario.description}
              </p>

              <div className="mt-auto pt-6 border-t border-slate-100 relative z-10">
                <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">
                      Objective Brief
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 italic">
                    "
                    {descriptions[scenario.id] ||
                      "Initializing mission intelligence..."}
                    "
                  </p>
                </div>

                <button
                  onClick={() => onLaunch(scenario.id)}
                  className="w-full py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-200 transition-all transform group-hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <span>Launch Simulation</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

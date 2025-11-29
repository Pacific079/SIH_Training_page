import React, { useState } from "react";
import { SimulationProvider, useSimulation } from "./context/SimulationContext";
import { SimulationPage, Dashboard } from "./pages";

const AppContent = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const { loadScenario } = useSimulation();

  const handleLaunch = (scenarioId) => {
    if (scenarioId) {
      loadScenario(scenarioId);
    }
    setCurrentView("simulation");
  };

  return (
    <>
      {currentView === "dashboard" ? (
        <Dashboard onLaunch={handleLaunch} />
      ) : (
        <div className="relative h-screen">
          <SimulationPage />

          {/* Back to Dashboard Button */}
          <button
            onClick={() => setCurrentView("dashboard")}
            className="fixed bottom-6 left-6 z-50 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-3 rounded-full border border-slate-600 shadow-xl transition-all hover:scale-110"
            title="Return to Dashboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

const App = () => {
  return (
    <div className="antialiased font-sans text-slate-100 selection:bg-blue-500 selection:text-white">
      <SimulationProvider>
        <AppContent />
      </SimulationProvider>
    </div>
  );
};

export default App;

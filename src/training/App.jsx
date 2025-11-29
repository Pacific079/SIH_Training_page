import React from "react";
import { SimulationProvider } from "./SimulationContext.jsx";
import Training from "./index.jsx";

const App = () => {
  return (
    <div className="antialiased font-sans text-slate-100 selection:bg-blue-500 selection:text-white">
      <SimulationProvider>
        <Training />
      </SimulationProvider>
    </div>
  );
};

export default App;

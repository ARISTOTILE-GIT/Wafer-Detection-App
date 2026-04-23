import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Prediction from "./pages/Prediction";
import BatchPrediction from "./pages/BatchPrediction";
import DrawMode from "./pages/DrawMode";
import YieldAnalysis from "./pages/YieldAnalysis";
import History from "./pages/History";

export default function App() {
  const [waferId, setWaferId] = useState("WAFER-001");
  const [dieArea, setDieArea] = useState(0.5);

  return (
    <div className="app-shell">
      <Sidebar
        waferId={waferId}
        dieArea={dieArea}
        onWaferIdChange={setWaferId}
        onDieAreaChange={setDieArea}
      />
      <main className="main-area">
        <Routes>
          <Route path="/" element={
            <Prediction waferId={waferId} dieArea={dieArea} />
          } />
          <Route path="/batch" element={
            <BatchPrediction dieArea={dieArea} />
          } />
          <Route path="/draw" element={
            <DrawMode waferId={waferId} dieArea={dieArea} />
          } />
          <Route path="/yield" element={
            <YieldAnalysis dieArea={dieArea} />
          } />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
    </div>
  );
}

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Placeholder for future feature routes/components
// import Dashboard from "./containers/Dashboard";
// import QuestLog from "./containers/QuestLog";

const DummyHome = () => (
  <div className="min-h-screen bg-secondary text-primary flex flex-col justify-center items-center">
    <h1 className="text-5xl font-bold mb-4">NeuroQuest: The Productivity RPG</h1>
    <p className="mb-2">Your gamified journey to supreme productivity begins. 🚀</p>
    <span className="text-accent font-mono">[Home]</span>
  </div>
);

// PUBLIC_INTERFACE
export default function App() {
  /** Main app container: wraps the Router and primary page routes */
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DummyHome />} />
        {/* Future: Modular containers/routes for features (auth, dashboard, quests, etc) */}
      </Routes>
    </BrowserRouter>
  );
}

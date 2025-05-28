import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./containers/Login";
import { useAuth } from "./AuthContext";

// NEW FEATURE CONTAINERS
import Dashboard from "./containers/Dashboard";
import QuestLog from "./containers/QuestLog";
import BossBattles from "./containers/BossBattles";
import Inventory from "./containers/Inventory";
import Settings from "./containers/Settings";

// PUBLIC_INTERFACE
function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  if (loading) return null; // Could show spinner or null during loading
  return currentUser ? children : <Navigate to="/login" replace />;
}

// PUBLIC_INTERFACE
export default function App() {
  /** Main app container: wraps the Router and primary page routes */
  return (
    <BrowserRouter>
      <Routes>
        {/* All feature containers except Login require authentication */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quest-log"
          element={
            <ProtectedRoute>
              <QuestLog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/boss-battles"
          element={
            <ProtectedRoute>
              <BossBattles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

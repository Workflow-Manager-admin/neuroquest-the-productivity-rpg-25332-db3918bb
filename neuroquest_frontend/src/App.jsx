import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BaseLayout from "./containers/BaseLayout";
import XPBar from "./components/XPBar";
import HPBar from "./components/HPBar";
import Avatar from "./components/Avatar";
import ZoneCard from "./components/ZoneCard";
import FloatingOrb from "./components/FloatingOrb";
import Login from "./containers/Login";
import { useAuth } from "./AuthContext";

// PUBLIC_INTERFACE
function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  if (loading) return null; // Could show spinner or null during loading
  return currentUser ? children : <Navigate to="/login" replace />;
}

// Simple mock dashboard using all base UI elements
function DashboardMock() {
  // These would normally be app state or API fetched
  const user = {
    name: "Arin Mindfire",
    xp: 320,
    maxXp: 500,
    hp: 42,
    maxHp: 50,
    avatar:
      "https://avatars.githubusercontent.com/u/2838673?s=200&v=4", // Placeholder img (can use Lottie or NFT later)
    level: 7,
  };

  const zones = [
    {
      title: "Focus Forest",
      icon: "🌲",
      description: "Deep work streaks & Pomodoro XP",
      accentColor: "accent",
    },
    {
      title: "Deadline Dungeon",
      icon: "⏰",
      description: "Boss battles vs. your toughest deadlines",
      accentColor: "primary",
    },
    {
      title: "Daily Hills",
      icon: "🌄",
      description: "Quick quests and habit streaks",
      accentColor: "emerald-300",
    },
  ];

  return (
    <BaseLayout>
      <header className="w-full py-6 px-4 flex flex-col items-center gap-3 md:flex-row md:justify-between md:items-end">
        <div className="flex items-center gap-4">
          <Avatar
            src={user.avatar}
            alt={`${user.name} Avatar`}
            level={user.level}
            size={80}
          />
          <div>
            <h1 className="text-3xl text-primary font-black tracking-tight drop-shadow">
              {user.name}
            </h1>
            <div className="flex gap-2 mt-1">
              <XPBar xp={user.xp} maxXp={user.maxXp} />
              <HPBar hp={user.hp} maxHp={user.maxHp} />
            </div>
          </div>
        </div>
      </header>
      <section className="w-full flex flex-col md:flex-row gap-7 px-4 py-3 justify-center items-stretch max-w-6xl mx-auto">
        {zones.map((zone) => (
          <ZoneCard
            key={zone.title}
            title={zone.title}
            icon={zone.icon}
            description={zone.description}
            accentColor={zone.accentColor}
            className="flex-1"
          >
            <div className="h-16 flex items-center justify-center">
              <span className="text-xl text-slate-400 italic">Coming soon...</span>
            </div>
          </ZoneCard>
        ))}
      </section>
      <FloatingOrb icon="🌀" onClick={() => alert("Access Quick Quest!")} />
    </BaseLayout>
  );
}

// PUBLIC_INTERFACE
export default function App() {
  /** Main app container: wraps the Router and primary page routes */
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardMock />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        {/* Future: Modular containers/routes for features (auth, dashboard, quests, etc) */}
      </Routes>
    </BrowserRouter>
  );
}

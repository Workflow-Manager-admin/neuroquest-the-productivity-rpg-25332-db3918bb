import React, { useState } from "react";
import BaseLayout from "./BaseLayout";
import FloatingOrb from "../components/FloatingOrb";
import Avatar from "../components/Avatar";
import XPBar from "../components/XPBar";
import HPBar from "../components/HPBar";
import ZoneCard from "../components/ZoneCard";
import { PlayerLottieCelebration } from "../components/PlayerLottieCelebration";
import { useAuth } from "../AuthContext";

/**
 * Dashboard: The main user hub—shows player info, zone navigation, quick stats, zones, and Lottie celebration.
 */
// PUBLIC_INTERFACE
export default function Dashboard() {
  // Simulated player data for demo.
  const { currentUser } = useAuth();
  const player = {
    displayName: currentUser?.displayName || "Adventurer",
    photoURL: currentUser?.photoURL || "https://api.dicebear.com/7.x/pixel-art/svg?seed=neurohero",
    level: 7,
    xp: 325,
    maxXp: 400,
    hp: 48,
    maxHp: 60,
    stats: {
      focus: 93,
      streak: 13,
      tokens: 120,
    },
  };

  // Lottie celebration handler
  const [showCelebration, setShowCelebration] = useState(false);
  const triggerCelebration = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  // Zone definitions
  const zones = [
    {
      title: "Focus Forest",
      icon: "🌲",
      description: "Enter deep work mode and grow your streak.",
      accentColor: "emerald-300",
      route: "/quest-log",
    },
    {
      title: "Deadline Dungeon",
      icon: "⏳",
      description: "Face your deadline boss battles!",
      accentColor: "fuchsia-400",
      route: "/boss-battles",
    },
    {
      title: "Daily Hills",
      icon: "🌄",
      description: "Complete daily quests for juicy rewards.",
      accentColor: "cyan-400",
      route: "/quest-log",
    },
    {
      title: "Inventory",
      icon: "💠",
      description: "Equip power-ups & claim rewards.",
      accentColor: "accent",
      route: "/inventory",
    },
  ];

  return (
    <BaseLayout>
      <div className="relative w-full max-w-4xl mx-auto flex flex-col gap-7 py-6 px-2 md:px-0">
        {/* Top section: Avatar, XP/HP, Level, Stats */}
        <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between gap-4 mb-4">
          {/* Avatar & Player Basics */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Avatar
              src={player.photoURL}
              alt={player.displayName}
              level={player.level}
              size={95}
            />
            <span className="font-semibold text-lg text-primary tracking-wide drop-shadow-glow">{player.displayName}</span>
            <span className="text-xs text-slate-400">Level {player.level}</span>
          </div>
          {/* XP/HP Bars & Quick Stats */}
          <div className="flex-1 flex flex-col gap-2 min-w-[230px] max-w-xl">
            <XPBar xp={player.xp} maxXp={player.maxXp} />
            <HPBar hp={player.hp} maxHp={player.maxHp} />
            {/* Quick Stats Row */}
            <div className="flex flex-row items-center gap-4 mt-2 text-xs justify-between text-slate-300">
              <span className="rounded-md bg-primary/40 px-2 font-bold">
                Focus: <span className="text-accent font-extrabold">{player.stats.focus}%</span>
              </span>
              <span className="rounded-md bg-fuchsia-900/70 px-2 font-bold">
                Streak: <span className="text-fuchsia-300 font-extrabold">{player.stats.streak}d</span>
              </span>
              <span className="rounded-md bg-accent/40 px-2 font-bold">
                Tokens: <span className="text-emerald-300 font-extrabold">{player.stats.tokens}</span>
              </span>
            </div>
          </div>
          {/* Lottie animation button (e.g., claim XP) */}
          <button
            className="bg-gradient-to-r from-primary to-accent px-4 py-2 rounded-xl text-white shadow hover:bg-primary/90 font-extrabold text-sm tracking-widest border-accent/90 border animate-glow"
            onClick={triggerCelebration}
            style={{ outline: "none" }}
          >
            Celebrate!
          </button>
        </div>

        {/* ZONES: Main navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {zones.map((zone) => (
            <ZoneCard
              key={zone.title}
              title={zone.title}
              icon={zone.icon}
              description={zone.description}
              accentColor={zone.accentColor}
            >
              {/* Navigation button to go to zone */}
              <a
                href={zone.route}
                className="inline-block mt-4 px-4 py-2 text-sm rounded-lg font-bold transition bg-gradient-to-r from-primary to-accent text-secondary shadow hover:bg-primary/90 animate-glow"
                style={{ filter: "drop-shadow(0 0 8px #4ade80cc)" }}
              >
                Enter
              </a>
            </ZoneCard>
          ))}
        </div>

        {/* Floating Quest Orb (quick add quest) */}
        <FloatingOrb
          icon="🌀"
          onClick={() => (window.location.href = "/quest-log")}
          aria-label="Jump to AI Quest Breakdown"
        />

        {/* Lottie Celebration Animation Overlay */}
        {showCelebration && (
          <PlayerLottieCelebration />
        )}
      </div>
    </BaseLayout>
  );
}

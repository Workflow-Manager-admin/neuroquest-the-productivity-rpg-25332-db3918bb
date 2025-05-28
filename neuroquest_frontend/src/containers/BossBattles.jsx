import React from "react";
import BaseLayout from "./BaseLayout";

/**
 * Boss Battles container
 * Triggers on deadlines. Will show battle animation, countdowns, results, etc.
 */
// PUBLIC_INTERFACE
export default function BossBattles() {
  return (
    <BaseLayout>
      <div className="flex flex-col items-center gap-4 py-10 px-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-fuchsia-400 drop-shadow">
          Boss Battles
        </h1>
        <p className="text-slate-400">
          Face your toughest deadlines and claim victory!
        </p>
        <span className="text-xl text-slate-500 mt-6 italic">Boss battles system coming soon...</span>
      </div>
    </BaseLayout>
  );
}

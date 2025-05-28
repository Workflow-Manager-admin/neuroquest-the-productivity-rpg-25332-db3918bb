import React from "react";
import BaseLayout from "./BaseLayout";

/**
 * Quest Log container — displays AI-generated and manual task lists,
 * grouped by quest type, plus action controls.
 */
// PUBLIC_INTERFACE
export default function QuestLog() {
  return (
    <BaseLayout>
      <div className="flex flex-col items-center gap-4 py-10 px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-accent drop-shadow-sm">
          Quest Log
        </h1>
        <p className="text-slate-400">
          Here you'll find your main quests, side quests, and microtasks!
        </p>
        <span className="text-xl text-slate-500 mt-6 italic">Log coming soon...</span>
      </div>
    </BaseLayout>
  );
}

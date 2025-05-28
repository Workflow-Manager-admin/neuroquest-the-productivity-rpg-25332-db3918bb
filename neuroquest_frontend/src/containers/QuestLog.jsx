import React from "react";
import BaseLayout from "./BaseLayout";
import QuestBreakdown from "../components/QuestBreakdown";

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
        <p className="text-slate-400 text-center mb-2">
          Here you'll find your Main Quests, Side Quests, and Microtasks — powered by AI!
        </p>
        {/* --- [AI Quest Breakdown Component] --- */}
        <QuestBreakdown />
      </div>
    </BaseLayout>
  );
}

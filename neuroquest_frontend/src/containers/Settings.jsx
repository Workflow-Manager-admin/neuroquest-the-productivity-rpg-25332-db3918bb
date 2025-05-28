import React from "react";
import BaseLayout from "./BaseLayout";

/**
 * Settings container
 * For theme toggles, changing main quest, calendar sync, and logout.
 */
// PUBLIC_INTERFACE
export default function Settings() {
  return (
    <BaseLayout>
      <div className="flex flex-col items-center gap-4 py-10 px-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-primary drop-shadow">
          Settings
        </h1>
        <p className="text-slate-400">
          Change your preferences, link calendars, or logout.
        </p>
        <span className="text-xl text-slate-500 mt-6 italic">
          Settings features coming soon...
        </span>
      </div>
    </BaseLayout>
  );
}

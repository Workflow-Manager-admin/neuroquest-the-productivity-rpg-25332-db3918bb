import React from "react";
import BaseLayout from "./BaseLayout";
import FloatingOrb from "../components/FloatingOrb";

/**
 * Dashboard: The main user hub—shows player info, zone navigation, quick stats
 * (Full logic to be added later. Placeholder only for now.)
 */
// PUBLIC_INTERFACE
export default function Dashboard() {
  return (
    <BaseLayout>
      <div className="flex flex-col items-center gap-5 py-10 px-4">
        <h1 className="text-3xl md:text-5xl font-black text-primary drop-shadow">
          NeuroQuest Dashboard
        </h1>
        <p className="text-slate-400 text-lg">
          Welcome back! This is your RPG productivity hub. (Content coming soon)
        </p>
        <FloatingOrb icon="🌀" onClick={() => alert("Access Quick Quest!")} />
      </div>
    </BaseLayout>
  );
}

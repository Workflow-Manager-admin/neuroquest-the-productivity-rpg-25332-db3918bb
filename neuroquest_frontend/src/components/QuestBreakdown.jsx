import React, { useState } from "react";
import { getQuestBreakdown } from "../api/openaiQuestBreakdown";

/**
 * QuestBreakdown - React component for AI-powered quest roadmap builder.
 * - Allows inputting a main goal
 * - Shows loading spinner, errors
 * - Shows the grouped quest breakdown (main questline, side quests, microtasks)
 * - Theming/UX matches fantasy-futuristic style.
 */
// PUBLIC_INTERFACE
export default function QuestBreakdown() {
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await getQuestBreakdown(goal);
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to fetch quest breakdown.");
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-secondary/90 rounded-2xl shadow-lg p-7 border-2 border-primary/40 mt-4 animate-glow-card">
      <h2 className="text-2xl font-extrabold text-accent drop-shadow mb-3 text-center">
        AI Quest Breakdown
      </h2>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <input
          className="rounded-xl bg-secondary border-accent/40 border-2 text-lg p-3 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-accent/50 transition"
          placeholder="What's your main quest? (e.g. Crack GATE CS 2025)"
          value={goal}
          onChange={e => setGoal(e.target.value)}
          disabled={loading}
          required
          autoFocus
        />
        <button
          type="submit"
          disabled={loading || !goal.trim()}
          className="bg-accent text-secondary font-extrabold rounded-xl p-3 mt-1 shadow-lg hover:bg-primary/80 hover:text-white transition-all border-accent/80 border-b-2 uppercase tracking-widest animate-glow"
        >
          {loading ? "Summoning Quest Guide..." : "Break it Down!"}
        </button>
      </form>
      {error && (
        <div className="rounded p-2 bg-rose-950/80 text-rose-300 mt-3 border border-rose-400 animate-error-shake">
          {error}
        </div>
      )}
      {loading && (
        <div className="w-full flex justify-center items-center my-4">
          <span className="animate-spin text-3xl text-accent">🌀</span>
        </div>
      )}
      {result && (
        <div className="flex flex-col gap-6 mt-5">
          <QuestSection
            title="Main Questline"
            items={result.mainQuestline}
            emoji="🏆"
            color="accent"
          />
          <QuestSection
            title="Side Quests"
            items={result.sideQuests}
            emoji="🌱"
            color="fuchsia-400"
          />
          <QuestSection
            title="Microtasks"
            items={result.microtasks}
            emoji="⚡"
            color="emerald-300"
          />
        </div>
      )}
      <style>{`
        .animate-glow-card {
          animation: glow 2.8s infinite alternate;
        }
        @keyframes glow {
          0% { box-shadow: 0 0 16px 4px #4ade80cc, 0 0 60px 4px #7c3aed66; }
          100% { box-shadow: 0 0 30px 8px #7c3aedbb, 0 0 65px 18px #4ade80aa; }
        }
        .animate-glow {
          animation: neonGlow 1.4s infinite alternate;
        }
        @keyframes neonGlow {
          0% { filter: drop-shadow(0 0 6px #4ade80bb);}
          100% { filter: drop-shadow(0 0 18px #7c3aedcc);}
        }
        .animate-error-shake {
          animation: shake 0.9s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%,90%{transform:translateX(-1px);}
          20%,80%{transform:translateX(2px);}
          30%,50%,70%{transform:translateX(-4px);}
          40%,60%{transform:translateX(4px);}
        }
      `}</style>
    </div>
  );
}

// Helper: section renderer
function QuestSection({ title, items, emoji, color }) {
  if (!Array.isArray(items) || !items.length) return null;
  return (
    <section>
      <h3 className={`text-xl font-bold mb-1 text-${color}`}>
        <span className="mr-2">{emoji}</span>
        {title}
      </h3>
      <ul className="ml-2 flex flex-col gap-1">
        {items.map((item, idx) => (
          <li
            key={idx}
            className={`rounded-lg pl-3 pr-2 py-1 bg-${color}/15 border-l-4 border-${color} text-white font-medium drop-shadow-sm transition-all`}
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

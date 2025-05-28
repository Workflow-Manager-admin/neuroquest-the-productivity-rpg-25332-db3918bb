/*
  QuestLog.jsx
  - RPG-style quest/task container: Manages state for grouped quest types (AI/manual), implements CRUD,
  integrates dnd-kit for drag-and-drop, calls OpenAI for manual rewrites, and synchronizes UI.
*/
import React, { useEffect, useState, useRef } from "react";
import BaseLayout from "./BaseLayout";
import QuestCard from "../components/QuestCard";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable
} from "@dnd-kit/sortable";
import { getQuestBreakdown } from "../api/openaiQuestBreakdown";

// PUBLIC_INTERFACE
function uuid() {
  // Simple unique id utility
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2,7)}`;
}

// PUBLIC_INTERFACE
export default function QuestLog() {
  // State: Grouped quest/task data
  const [quests, setQuests] = useState({
    main: [],   // AI: main story
    side: [],   // AI: optional
    micro: [],  // AI: microtasks
    manual: [], // Manual user-added
  });
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [rewriteLoadingId, setRewriteLoadingId] = useState(null);
  const [newTaskText, setNewTaskText] = useState("");
  const inputRef = useRef();

  // On mount: load from localStorage if present
  useEffect(() => {
    const saved = localStorage.getItem("questsData");
    const savedGoal = localStorage.getItem("mainGoal");
    if (saved) setQuests(JSON.parse(saved));
    if (savedGoal) setGoal(savedGoal);
  }, []);
  // Persist quests and goal to localStorage
  useEffect(() => {
    localStorage.setItem("questsData", JSON.stringify(quests));
  }, [quests]);
  useEffect(() => {
    localStorage.setItem("mainGoal", goal);
  }, [goal]);

  // Helper: Convert OpenAI breakdown to canonical quests state
  function aiToQuests(ai) {
    return {
      main: (ai?.mainQuestline || []).map((text, i) => ({
        id: `main-${uuid()}`,
        text, completed: false, type: "main", isManual: false,
      })),
      side: (ai?.sideQuests || []).map((text, i) => ({
        id: `side-${uuid()}`,
        text, completed: false, type: "side", isManual: false,
      })),
      micro: (ai?.microtasks || []).map((text, i) => ({
        id: `micro-${uuid()}`,
        text, completed: false, type: "micro", isManual: false,
      })),
      manual: quests.manual || [],
    };
  }

  // -- CRUD logic --
  function handleAddManual(e) {
    e.preventDefault();
    const txt = newTaskText.trim();
    if (!txt) return;
    setQuests((prev) => ({
      ...prev,
      manual: [
        ...prev.manual,
        {
          id: `manual-${uuid()}`,
          text: txt,
          completed: false,
          type: "manual",
          isManual: true,
        },
      ],
    }));
    setNewTaskText("");
    // Optionally, focus back to input (UX)
    if (inputRef.current) inputRef.current.focus();
  }
  function handleCheck(id, type) {
    setQuests((old) => ({
      ...old,
      [type]: old[type].map((q) =>
        q.id === id ? { ...q, completed: !q.completed } : q
      ),
    }));
  }
  function handleDelete(id, type) {
    setQuests((old) => ({
      ...old,
      [type]: old[type].filter((q) => q.id !== id),
    }));
  }

  // --- OpenAI AI Rewrite integration for manual task ---
  async function handleRewrite(id) {
    setRewriteLoadingId(id);
    try {
      const manualTask = quests.manual.find((q) => q.id === id);
      if (!manualTask) return;
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) throw new Error("VITE_OPENAI_API_KEY missing!");
      const prompt = [
        { role: "system", content: "You are NeuroQuestGPT. Rewrite this task for an RPG quest log—make it actionable, brief, and fantasy-themed (max 2 lines)." },
        { role: "user", content: manualTask.text },
      ];
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: prompt,
          temperature: 0.6,
          max_tokens: 60,
        }),
      });
      const data = await res.json();
      const revised = data?.choices?.[0]?.message?.content?.trim() || manualTask.text;
      setQuests((old) => ({
        ...old,
        manual: old.manual.map((q) => q.id === id ? { ...q, text: revised } : q),
      }));
    } catch (err) {
      alert("OpenAI failed to rewrite task: " + (err?.message || String(err)));
    }
    setRewriteLoadingId(null);
  }

  // ----- OpenAI "AI Breakdown" Main Quest Handler -----
  async function handleAIBreakdown(e) {
    e.preventDefault();
    setLoading(true);
    setAiError("");
    try {
      const aiResult = await getQuestBreakdown(goal);
      setQuests(old => ({
        ...aiToQuests(aiResult),
        manual: old.manual,  // persist any user-added tasks
      }));
    } catch (err) {
      setAiError(err?.message || "Failed to summon quest map!");
    }
    setLoading(false);
  }

  // --- DND-kit drag-and-drop reordering within each quest group ---
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );
  function handleDragEnd(evt, group) {
    const { active, over } = evt;
    if (!over || active.id === over.id) return;
    setQuests((old) => {
      const items = [...old[group]];
      const oldIdx = items.findIndex((q) => q.id === active.id);
      const newIdx = items.findIndex((q) => q.id === over.id);
      if (oldIdx === -1 || newIdx === -1) return old;
      const moved = arrayMove(items, oldIdx, newIdx);
      return { ...old, [group]: moved };
    });
  }

  // --- Quest Group renderer: Renders a list of QuestCards of same type, sortable via DnD. ---
  function QuestGroup({ group, title, emoji, color }) {
    const qs = quests[group] || [];
    return (
      <section className="mb-7 w-full max-w-xl">
        <h2 className={`text-lg font-bold mb-1 text-${color}`}>
          <span className="mr-2">{emoji}</span>
          {title}
        </h2>
        <DndContext
          collisionDetection={closestCenter}
          sensors={sensors}
          onDragEnd={evt => handleDragEnd(evt, group)}
        >
          <SortableContext
            items={qs.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            {qs.length === 0 && (
              <div className="italic text-slate-500 text-sm px-3 py-1">
                No quests yet.
              </div>
            )}
            {qs.map((quest) => (
              <SortableQuestCard
                key={quest.id}
                quest={quest}
                onCheck={() => handleCheck(quest.id, group)}
                onDelete={() => handleDelete(quest.id, group)}
                onRewrite={
                  quest.isManual
                    ? () => handleRewrite(quest.id)
                    : undefined
                }
                loading={rewriteLoadingId === quest.id}
              />
            ))}
          </SortableContext>
        </DndContext>
      </section>
    );
  }

  // --- Sortable wrapper around QuestCard for DnD ---
  function SortableQuestCard({ quest, onCheck, onDelete, onRewrite, loading }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
      useSortable({ id: quest.id });
    return (
      <div ref={setNodeRef} style={{ touchAction: "pan-y" }}>
        <QuestCard
          quest={quest}
          onCheck={onCheck}
          onDelete={onDelete}
          onRewrite={onRewrite}
          dragProps={{
            attributes, listeners, transform, transition,
          }}
          isDragging={isDragging}
          style={loading ? { opacity: 0.6, pointerEvents: "none" } : {}}
        />
      </div>
    );
  }

  // UI
  return (
    <BaseLayout>
      <div className="flex flex-col items-center gap-4 py-10 px-4 w-full">
        <h1 className="text-3xl md:text-5xl font-bold text-accent drop-shadow-sm">
          Quest Log
        </h1>
        <p className="text-slate-400 text-center mb-3">
          Main Quests, Side Quests, Microtasks & Manual tasks.<br />
          List, reorder, complete, add, <span className="font-bold text-fuchsia-300">or let AI break down your goal!</span>
        </p>
        {/* --- [AI Quest Breakdown Input Bar] --- */}
        <form className="flex w-full max-w-xl mb-6 gap-2" onSubmit={handleAIBreakdown}>
          <input
            className="flex-1 rounded-xl bg-secondary border-accent/40 border-2 text-lg p-3 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-accent/50 transition"
            placeholder="What's your main quest? (e.g. Crack GATE CS 2025)"
            value={goal}
            onChange={e => setGoal(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !goal.trim()}
            className="bg-accent text-secondary font-extrabold rounded-xl px-4 py-3 shadow-lg hover:bg-primary/80 hover:text-white transition-all border-accent/80 border-b-2 uppercase tracking-widest animate-glow"
          >
            {loading ? "Summoning..." : "AI Breakdown"}
          </button>
        </form>
        {aiError && (
          <div className="rounded p-2 bg-rose-950/80 text-rose-300 mb-2 border border-rose-400 animate-error-shake">
            {aiError}
          </div>
        )}

        {/* --- Quest Groups --- */}
        <QuestGroup group="main"  title="Main Questline" emoji="🏆" color="accent" />
        <QuestGroup group="side"  title="Side Quests"   emoji="🌱" color="fuchsia-400" />
        <QuestGroup group="micro" title="Microtasks"    emoji="⚡" color="emerald-300" />
        <QuestGroup group="manual" title="Manual Tasks" emoji="✏️" color="cyan-400" />

        {/* --- Add new manual task form --- */}
        <form
          onSubmit={handleAddManual}
          className="flex mt-2 max-w-xl w-full gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            className="flex-1 rounded-xl bg-secondary border-cyan-400/40 border-2 text-base p-2 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition"
            placeholder="Add your own quest/task"
            value={newTaskText}
            onChange={e => setNewTaskText(e.target.value)}
            maxLength={100}
            disabled={false}
          />
          <button
            type="submit"
            className="rounded-xl px-3 py-2 font-bold bg-gradient-to-br from-accent to-cyan-400 text-secondary shadow hover:bg-primary/90 border-accent/80 border animate-glow"
            disabled={!newTaskText.trim()}
          >Add</button>
        </form>

        {/* --- animated styles --- */}
        <style>{`
          .animate-glow {
            animation: neonGlow 1.35s infinite alternate;
          }
          @keyframes neonGlow {
            0% { filter: drop-shadow(0 0 6px #4ade80bb);}
            100% { filter: drop-shadow(0 0 15px #7c3aedcc);}
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
    </BaseLayout>
  );
}

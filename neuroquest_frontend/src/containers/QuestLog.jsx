import React, { useEffect, useState } from "react";
import BaseLayout from "./BaseLayout";
import QuestCard from "../components/QuestCard";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getQuestBreakdown } from "../api/openaiQuestBreakdown";

// Helper to generate unique ids for manual tasks
function uuid() {
  return (
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).slice(2, 8)
  );
}

// PUBLIC_INTERFACE
export default function QuestLog() {
  // questsData: {main:[], side:[], micro:[], manual:[]}
  const [questsData, setQuestsData] = useState({
    main: [],
    side: [],
    micro: [],
    manual: [],
  });
  const [loading, setLoading] = useState(false);
  const [goal, setGoal] = useState("");
  const [aiError, setAiError] = useState("");
  const [rewriteLoadingId, setRewriteLoadingId] = useState(null);
  const [newTaskText, setNewTaskText] = useState("");

  // On mount, optionally load last state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("questsData");
    const savedGoal = localStorage.getItem("mainGoal");
    if (saved) setQuestsData(JSON.parse(saved));
    if (savedGoal) setGoal(savedGoal);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem("questsData", JSON.stringify(questsData));
  }, [questsData]);
  useEffect(() => {
    if (goal) localStorage.setItem("mainGoal", goal);
  }, [goal]);

  // Helper to structure OpenAI output to questsData format
  const aiToQuestsData = (data) => ({
    main: (data?.mainQuestline || []).map((text, i) => ({
      id: "main-" + i + "-" + uuid(),
      text,
      completed: false,
      type: "main",
      isManual: false,
    })),
    side: (data?.sideQuests || []).map((text, i) => ({
      id: "side-" + i + "-" + uuid(),
      text,
      completed: false,
      type: "side",
      isManual: false,
    })),
    micro: (data?.microtasks || []).map((text, i) => ({
      id: "micro-" + i + "-" + uuid(),
      text,
      completed: false,
      type: "micro",
      isManual: false,
    })),
    manual: questsData.manual || [],
  });

  // Handler: AI Rewrite for a manual task
  async function handleRewrite(id) {
    setRewriteLoadingId(id);
    try {
      const manualTask = questsData.manual.find((q) => q.id === id);
      if (!manualTask) return;
      // Use OpenAI to rewrite/improve the description
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) throw new Error("VITE_OPENAI_API_KEY missing from environment!");
      const prompt = [
        {
          role: "system",
          content:
            "You are NeuroQuestGPT. Rewrite the given todo/task for an RPG quest log. Make it snappier, more actionable, and fantasy-flavored. 1-2 sentences MAX.",
        },
        { role: "user", content: `Task: ${manualTask.text}` },
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
          temperature: 0.65,
          max_tokens: 50,
        }),
      });
      const data = await res.json();
      const revised =
        data?.choices?.[0]?.message?.content?.trim() ||
        manualTask.text;
      setQuestsData((old) => ({
        ...old,
        manual: old.manual.map((q) =>
          q.id === id ? { ...q, text: revised } : q
        ),
      }));
    } catch (err) {
      alert(
        "OpenAI failed to rewrite task: " + (err?.message || String(err))
      );
    }
    setRewriteLoadingId(null);
  }

  // Handler: AI breakdown for user-entered goal
  async function handleAIBreakdown(e) {
    e.preventDefault();
    setLoading(true);
    setAiError("");
    try {
      const data = await getQuestBreakdown(goal);
      setQuestsData((old) => ({
        // Wipe old AI tasks, but keep manual tasks
        ...aiToQuestsData(data),
        manual: old.manual,
      }));
    } catch (err) {
      setAiError(err?.message || "Failed to summon quest map!");
    }
    setLoading(false);
  }

  // Handler: Add manual task
  function handleAddManual(e) {
    e.preventDefault();
    const txt = newTaskText.trim();
    if (!txt) return;
    setQuestsData((old) => ({
      ...old,
      manual: [
        ...old.manual,
        {
          id: "manual-" + uuid(),
          text: txt,
          completed: false,
          type: "manual",
          isManual: true,
        },
      ],
    }));
    setNewTaskText("");
  }

  // Handler: Check-off or uncheck
  function handleCheck(id, type) {
    setQuestsData((old) => ({
      ...old,
      [type]: old[type].map((q) =>
        q.id === id ? { ...q, completed: !q.completed } : q
      ),
    }));
  }
  // Handler: Delete
  function handleDelete(id, type) {
    setQuestsData((old) => ({
      ...old,
      [type]: old[type].filter((q) => q.id !== id),
    }));
  }

  // DnD-Kit setup: We'll have a SortableContext per group
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  function handleDragEnd(evt, group) {
    const { active, over } = evt;
    if (!over || active.id === over.id) return;
    setQuestsData((old) => {
      const copy = { ...old };
      const items = copy[group].slice();
      const oldIdx = items.findIndex((q) => q.id === active.id);
      const newIdx = items.findIndex((q) => q.id === over.id);
      if (oldIdx === -1 || newIdx === -1) return old; // broken DnD
      copy[group] = arrayMove(items, oldIdx, newIdx);
      return copy;
    });
  }

  // UI for a group of quests
  function QuestGroup({ group, title, emoji, color }) {
    const quests = questsData[group] || [];
    // Each SortableContext is for DnD reordering within its group
    return (
      <section className="mb-7 w-full max-w-xl">
        <h2 className={`text-lg font-bold mb-1 text-${color}`}>
          <span className="mr-2">{emoji}</span>
          {title}
        </h2>
        <DndContext
          collisionDetection={closestCenter}
          sensors={sensors}
          onDragEnd={(evt) => handleDragEnd(evt, group)}
        >
          <SortableContext
            items={quests.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            {quests.length === 0 && (
              <div className="italic text-slate-500 text-sm px-3 py-1">
                No quests yet.
              </div>
            )}
            {quests.map((quest) => (
              <SortableQuestCard
                key={quest.id}
                quest={quest}
                onCheck={() => handleCheck(quest.id, group)}
                onDelete={() => handleDelete(quest.id, group)}
                onRewrite={quest.isManual ? () => handleRewrite(quest.id) : undefined}
                loading={rewriteLoadingId === quest.id}
              />
            ))}
          </SortableContext>
        </DndContext>
      </section>
    );
  }

  // Wrapper for drag-and-droppable QuestCard
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
            attributes,
            listeners,
            transform,
            transition,
          }}
          isDragging={isDragging}
          style={loading ? { opacity: 0.6, pointerEvents: "none" } : {}}
        />
      </div>
    );
  }

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
        {/* --- [AI Quest Breakdown Prompt Bar] --- */}
        <form
          className="flex w-full max-w-xl mb-6 gap-2"
          onSubmit={handleAIBreakdown}
        >
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

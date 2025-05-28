import React from "react";
import clsx from "classnames";
import {CSS} from "@dnd-kit/utilities";

/**
 * QuestCard: Animated RPG-style, DnD-ready quest/task card
 * Props:
 * - quest: { id, text, completed, type: "main"|"side"|"micro"|"manual", isManual? }
 * - onCheck (id)
 * - onDelete (id)
 * - onRewrite (id)   // Show button only if isManual
 * - dragProps: optional, DnD bindings
 * - style: optional, injected DnD transform/style
 * - isDragging: optional, true if currently being dragged
 */
// PUBLIC_INTERFACE
export default function QuestCard({
  quest,
  onCheck,
  onDelete,
  onRewrite,
  dragProps = {},
  style = {},
  isDragging = false,
}) {
  const { id, text, completed, type, isManual } = quest;

  const typeAccent = {
    main: "accent",
    side: "fuchsia-400",
    micro: "emerald-300",
    manual: "cyan-400" // manual user-added, or fallback
  }[type] || "accent";

  return (
    <div
      className={clsx(
        "relative flex items-center group select-none rounded-xl px-4 py-2 mb-2 shadow-lg transition-all ease-in-out duration-200",
        `border-l-4 border-${typeAccent}`,
        completed
          ? "bg-secondary/60 saturate-0 opacity-60 line-through"
          : "bg-secondary/90 hover:bg-secondary/95",
        isDragging && "z-20 scale-105 shadow-2xl border-accent/70 ring-4 ring-accent/40"
      )}
      style={{
        ...style,
        touchAction: "pan-y",
        // dnd-kit style to animate drag: CSS.Translate diff
        ...(dragProps && dragProps.transform
          ? {
              transform: CSS.Transform.toString(dragProps.transform),
              transition: dragProps.transition,
            }
          : {}),
      }}
      data-quest-type={type}
      data-dnd-id={id}
      {...dragProps?.listeners}
      {...dragProps?.attributes}
    >
      {/* DnD Handle */}
      <span
        className={clsx(
          "cursor-grab mr-3 text-xl text-primary/80 hover:text-accent select-none transition",
          isDragging && "text-accent drop-shadow"
        )}
        {...dragProps?.listeners}
        tabIndex={-1}
        title="Drag to reorder"
        aria-label="Drag handle"
      >
        ☰
      </span>
      {/* Check-off box */}
      <input
        type="checkbox"
        checked={!!completed}
        onChange={() => onCheck(id)}
        className={clsx(
          "mr-3 w-5 h-5 rounded shadow border-2 border-primary bg-secondary/90 transition-all outline-none"
        )}
        aria-label="Check off"
      />
      {/* Quest/task text */}
      <span
        className={clsx(
          "flex-1 text-base font-medium tracking-tight",
          completed
            ? "text-slate-400"
            : `text-${typeAccent} drop-shadow-glow`
        )}
        style={{
          textShadow: completed
            ? "none"
            : `0 0 4px #4ade80aa, 0 0 20px #7c3aed77`,
        }}
      >
        {text}
      </span>
      {/* Actions: AI Rewrite (manual only) */}
      {isManual && typeof onRewrite === "function" && (
        <button
          className={clsx(
            "ml-2 px-2 py-1 rounded-lg bg-gradient-to-br from-accent/80 to-fuchsia-900 text-xs font-bold text-secondary shadow hover:bg-primary/90 transition animate-glow"
          )}
          style={{ minWidth: 36 }}
          aria-label="Rewrite with AI"
          onClick={() => onRewrite(id)}
        >
          ✨Rewrite
        </button>
      )}
      {/* Delete action */}
      <button
        className="ml-2 px-2 py-1 rounded-lg bg-rose-900/60 border border-rose-400 text-xs font-bold text-rose-300 shadow hover:bg-rose-700/80 hover:text-white transition"
        aria-label="Delete quest"
        onClick={() => onDelete(id)}
        tabIndex={0}
      >
        ✕
      </button>
      {/* Animated neon border and glow */}
      <style>{`
        .drop-shadow-glow {
          filter: drop-shadow(0 0 3px #4ade80cc) drop-shadow(0 0 8px #7c3aed66);
        }
        .animate-glow {
          animation: neonGlow 1.6s infinite alternate;
        }
        @keyframes neonGlow {
          0% { filter: drop-shadow(0 0 2px #4ade80bb);}
          100% { filter: drop-shadow(0 0 8px #7c3aedcc);}
        }
      `}</style>
    </div>
  );
}

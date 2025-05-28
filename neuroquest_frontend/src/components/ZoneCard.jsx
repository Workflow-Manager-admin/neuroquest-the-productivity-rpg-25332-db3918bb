import React from "react";
import clsx from "classnames";

/**
 * ZoneCard represents a major dashboard section (Focus Forest, Deadline Dungeon, etc).
 *
 * Props:
 * - title (string): Zone name
 * - icon (ReactNode): Optional icon or emoji
 * - description (string): Optional
 * - children (ReactNode): Optional zone content
 * - accentColor (string): Optional Tailwind color override for border/glow
 */
 // PUBLIC_INTERFACE
export default function ZoneCard({
  title,
  icon,
  description,
  children,
  accentColor = "accent",
}) {
  return (
    <section
      className={clsx(
        "relative bg-secondary/80 border-2 rounded-2xl p-5 flex flex-col shadow-xl",
        `border-${accentColor}`,
        "hover:shadow-2xl transition-shadow duration-200",
        "before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none",
        "before:opacity-60 before:blur-[4px]",
        "before:bg-gradient-to-br before:from-primary/30 before:via-transparent before:to-accent/25"
      )}
      style={{
        boxShadow: "0 0 18px 1px #4ade80aa, 0 0 44px 4px #7c3aed55",
      }}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span className={clsx("text-3xl drop-shadow", `text-${accentColor}`)}>{icon}</span>
        )}
        <h2 className={clsx("text-xl font-bold text-primary", `text-${accentColor}`)}>{title}</h2>
      </div>
      {description && (
        <p className="text-slate-300 mb-2 mt-1">{description}</p>
      )}
      {children}
    </section>
  );
}

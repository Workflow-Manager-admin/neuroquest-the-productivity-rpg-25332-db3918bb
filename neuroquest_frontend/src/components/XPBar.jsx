import React from "react";
import clsx from "classnames";

/**
 * XPBar displays the user's current XP status as a glowing, animated bar.
 *
 * Props:
 * - xp (number): Current XP value.
 * - maxXp (number): Maximum XP for next level.
 */
 // PUBLIC_INTERFACE
export default function XPBar({ xp, maxXp }) {
  const percent = Math.min((xp / maxXp) * 100, 100);

  return (
    <div className="w-full flex flex-col gap-1">
      <span className="text-xs text-accent font-mono tracking-wide">XP</span>
      <div className="w-full h-6 bg-secondary/60 rounded-full relative shadow-inner overflow-hidden border border-accent">
        <div
          className={clsx(
            "absolute top-0 left-0 h-full rounded-full transition-all duration-400",
            "bg-gradient-to-r from-accent via-primary to-accent",
            "shadow-lg shadow-accent/60"
          )}
          style={{
            width: `${percent}%`,
            boxShadow: "0 0 12px 4px #4ade80cc, 0 0 60px 3px #7c3aed44 inset",
          }}
        />
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-mono text-white mix-blend-difference drop-shadow">
          {xp} / {maxXp}
        </span>
      </div>
    </div>
  );
}

import React from "react";
import clsx from "classnames";

/**
 * HPBar displays the player's health points as a glowing, animated bar.
 *
 * Props:
 * - hp (number): Current HP value.
 * - maxHp (number): Maximum HP.
 */
 // PUBLIC_INTERFACE
export default function HPBar({ hp, maxHp }) {
  const percent = Math.min((hp / maxHp) * 100, 100);

  return (
    <div className="w-full flex flex-col gap-1">
      <span className="text-xs text-rose-400 font-mono tracking-wide">HP</span>
      <div className="w-full h-6 bg-secondary/80 rounded-full relative shadow-inner overflow-hidden border border-rose-400/70">
        <div
          className={clsx(
            "absolute top-0 left-0 h-full rounded-full transition-all duration-400",
            "bg-gradient-to-r from-red-500 via-pink-500 via-60% to-fuchsia-400",
            "shadow-lg shadow-rose-400/50"
          )}
          style={{
            width: `${percent}%`,
            boxShadow: "0 0 12px 4px #fb7185cc, 0 0 60px 2px #f472b633 inset",
          }}
        />
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-mono text-white mix-blend-difference drop-shadow">
          {hp} / {maxHp}
        </span>
      </div>
    </div>
  );
}

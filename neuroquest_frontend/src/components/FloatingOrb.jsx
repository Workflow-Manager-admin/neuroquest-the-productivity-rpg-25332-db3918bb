import React from "react";
import clsx from "classnames";

/**
 * FloatingOrb is a circular glowing action button for quick access.
 *
 * Props:
 * - icon (ReactNode): The center icon
 * - onClick (function): Click handler
 * - className (string): Extra Tailwind classes
 */
 // PUBLIC_INTERFACE
export default function FloatingOrb({ icon, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "fixed z-40 right-7 bottom-7 flex items-center justify-center",
        "w-20 h-20 rounded-full bg-gradient-to-br from-primary via-accent to-primary",
        "shadow-[0_0_32px_12px_#7c3aed44,_0_0_44px_3px_#4ade80cc]",
        "hover:scale-105 transition-all duration-200 ease-out",
        "text-white text-4xl font-bold border-4 border-accent animate-pulse",
        className
      )}
      style={{
        boxShadow:
          "0 0 0 2px #4ade80bb, 0 0 32px 8px #7c3aed99, 0 0 60px 8px #27253E inset",
        filter: "drop-shadow(0 0 14px #4ade80d8)",
      }}
      aria-label="Open Quest Orb"
    >
      {icon}
    </button>
  );
}

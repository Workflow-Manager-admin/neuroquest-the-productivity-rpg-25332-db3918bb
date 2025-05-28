import React from "react";

/**
 * BaseLayout provides the fantasy-futuristic neon background styling and glow overlay layer.
 * Wrap your routes/containers in this for global background/theming.
 */
 // PUBLIC_INTERFACE
export default function BaseLayout({ children }) {
  return (
    <div className="relative min-h-screen w-full flex flex-col bg-secondary overflow-x-hidden font-sans">
      {/* Neon blurred background accent layers */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute w-[70vw] h-[50vw] bg-primary/40 rounded-full blur-[96px] top-[-18vh] left-[-12vw]"/>
        <div className="absolute w-[60vw] h-[30vw] bg-accent/20 rounded-full blur-[60px] top-[28vh] right-[-28vw] rotate-12"/>
        <div className="absolute w-[55vw] h-[24vw] bg-primary/30 rounded-full blur-[60px] bottom-[-8vh] left-[-20vw]"/>
        <div className="absolute w-[25vw] h-[18vw] bg-accent/30 rounded-full blur-[48px] bottom-[12vh] right-[-14vw]"/>
        {/* Faint grid/futuristic lines */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.065]"/>
      </div>
      {/* Glow inner ring */}
      <div className="absolute inset-0 pointer-events-none -z-0 rounded-2xl border-[6px] border-primary/10" style={{boxShadow:'0 0 90px 9px #7c3aed44, 0 0 8px 2px #4ade80bb'}}>
      </div>
      {/* Content */}
      <main className="relative z-10 flex-1 flex flex-col">{children}</main>
    </div>
  );
}

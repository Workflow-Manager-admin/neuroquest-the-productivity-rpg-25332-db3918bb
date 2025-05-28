import React from "react";

/**
 * Avatar component displays the user's avatar in a neon-futuristic style.
 *
 * Props:
 * - src (string): Image source URL
 * - alt (string): Alt text
 * - level (number): Optional: shows player level as badge
 * - size (number): Optional: pixel size (default: 72)
 */
 // PUBLIC_INTERFACE
export default function Avatar({ src, alt = "Avatar", level, size = 72 }) {
  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt={alt}
        className="object-cover rounded-full border-4 border-primary shadow-lg"
        style={{
          width: size,
          height: size,
          boxShadow:
            "0 0 0 4px #4ade80aa, 0 0 32px 6px #7c3aed66, 0 0 1px 1px #0f172a inset",
        }}
      />
      {level !== undefined && (
        <span className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
          Lv {level}
        </span>
      )}
    </div>
  );
}

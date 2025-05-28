import React from "react";
import Lottie from "lottie-react";

/**
 * Renders a Lottie celebration overlay (e.g. confetti)
 * - Covers dashboard with a victory/confetti celebration.
 * - Animation disappears after a timeout (handled by parent).
 * 
 * Animation data is included inline (small Lottie JSON).
 * Could be swapped for an external file for custom branding later.
 */
// PUBLIC_INTERFACE
export function PlayerLottieCelebration() {
  // Small confetti Lottie sample. Replace with a fancy theme animation if desired.
  const confettiJson = {
    "v": "5.8.1",
    "fr": 30,
    "ip": 0,
    "op": 90,
    "w": 600,
    "h": 600,
    "nm": "Confetti Celebration",
    "ddd": 0,
    "assets": [],
    "layers": [
      {
        "ddd": 0,
        "ind": 1,
        "ty": 4,
        "nm": "confetti",
        "sr": 1,
        "ks": {
          "o": { "a": 0, "k": 100 },
          "r": { "a": 0, "k": 0 },
          "p": { "a": 0, "k": [300, 560, 0] },
          "a": { "a": 0, "k": [0, 0, 0] },
          "s": { "a": 0, "k": [100, 100, 100] }
        },
        "shapes": [
          // Simple sample confetti lines and dots...
          // [Can expand with more shapes for a richer effect]
          {
            "ty": "gr",
            "it": [
              {
                "ty": "rc",
                "s": { "a": 0, "k": [20, 4] },
                "p": { "a": 0, "k": [0, 0] },
                "r": { "a": 0, "k": 1 }
              },
              {
                "ty": "fl",
                "c": { "a": 0, "k": [0.48, 0.89, 0.5, 1] }
              }
            ]
          }
        ],
        "ip": 0,
        "op": 90,
        "st": 0,
        "bm": 0
      }
    ]
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/55 animate-fade-in"></div>
      <div className="relative flex items-center justify-center w-full h-full">
        <Lottie
          animationData={confettiJson}
          loop={false}
          autoplay={true}
          style={{ width: 320, height: 320 }}
        />
        <span className="absolute bottom-12 left-1/2 -translate-x-1/2 text-accent text-2xl font-black drop-shadow tracking-widest animate-pop-bounce">
          🎉 Quest Complete! 🎉
        </span>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.6s ease both; }
        @keyframes popBounce {
          0% { transform: scale(0.7); opacity: 0; }
          60% { transform: scale(1.15); opacity: 1;}
          85% { transform: scale(1); }
          100% { transform: scale(1); }
        }
        .animate-pop-bounce { animation: popBounce 0.88s cubic-bezier(.36,1.5,.2,1) both; }
      `}
      </style>
    </div>
  );
}

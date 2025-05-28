import React from "react";
import BaseLayout from "./BaseLayout";

/**
 * Inventory & Rewards container
 * Shows Soul Tokens, cosmetic rewards, NFT unlockables.
 */
// PUBLIC_INTERFACE
export default function Inventory() {
  return (
    <BaseLayout>
      <div className="flex flex-col items-center gap-4 py-10 px-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-emerald-300 drop-shadow">
          Inventory & Rewards
        </h1>
        <p className="text-slate-400">
          Level up, collect soul tokens, and unlock legendary gear!
        </p>
        <span className="text-xl text-slate-500 mt-6 italic">
          Inventory coming soon...
        </span>
      </div>
    </BaseLayout>
  );
}

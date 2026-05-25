"use client";

export default function StickyInvestmentCTA() {
  return (
    <div className="fixed bottom-5 left-4 right-4 z-50 md:hidden">
      <button className="w-full rounded-xl bg-green-600 py-4 text-lg font-bold text-white shadow-[0_20px_50px_rgba(22,163,74,0.45)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-green-700">
        Talk To Investment Expert
      </button>
    </div>
  );
}

'use client';

interface ResultModalProps {
  winner: string | null;
  onClose: () => void;
  onSpinAgain: () => void;
  onRemoveAndSpin: () => void;
}

export default function ResultModal({ winner, onClose, onSpinAgain, onRemoveAndSpin }: ResultModalProps) {
  if (winner === null) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Spin result"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 
        rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center gap-6 text-center
        animate-in fade-in zoom-in-95 duration-200">
        
        {/* Confetti emoji decoration */}
        <div className="text-5xl">🎉</div>

        <div>
          <p className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-widest">Winner</p>
          <h2 className="text-3xl font-bold text-white break-words leading-tight">{winner}</h2>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onSpinAgain}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600
              text-white font-bold transition-all hover:from-indigo-400 hover:to-purple-500 
              hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95"
          >
            Spin again
          </button>

          <button
            onClick={onRemoveAndSpin}
            className="w-full px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600
              text-white font-semibold transition-all active:scale-95"
          >
            Remove &amp; spin again
          </button>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

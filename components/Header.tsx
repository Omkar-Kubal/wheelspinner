import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            W
          </div>
          <span className="text-white font-bold text-base tracking-tight group-hover:text-indigo-300 transition-colors">
            WheelSpinner
          </span>
        </Link>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Free Tool
        </span>
      </div>
    </header>
  );
}

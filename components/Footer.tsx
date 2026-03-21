import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-900/50 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <span>© {new Date().getFullYear()} WheelSpinner. Free to use.</span>
        <nav className="flex gap-6">
          <Link href="/about" className="hover:text-slate-300 transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}

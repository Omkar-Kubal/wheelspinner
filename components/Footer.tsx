import Link from 'next/link';
import AdSlot from '@/components/AdSlot';

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50/50 mt-16">
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <AdSlot slot="9876543210" format="leaderboard" className="w-full" />
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <span>© {new Date().getFullYear()} WheelSpinner. Free to use.</span>
        <nav className="flex gap-6">
          <Link href="/about" className="hover:text-gray-900 transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}

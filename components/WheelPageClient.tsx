'use client';

import { useState, useEffect, useCallback } from 'react';
import SpinWheel from '@/components/SpinWheel';
import WheelControls from '@/components/WheelControls';
import ResultModal from '@/components/ResultModal';

const DEFAULT_ITEMS = ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan'];
const LS_KEY = 'wheelspinner_items';

interface WheelPageClientProps {
  defaultItems?: string[];
}

export default function WheelPageClient({ defaultItems }: WheelPageClientProps) {
  const [items, setItems] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [spinKey, setSpinKey] = useState(0);

  // Load items priority: URL params → page defaultItems → localStorage → global defaults
  useEffect(() => {
    // Split the raw search string before any URLSearchParams decoding so that encoded
    // commas (%2C) inside item values are not mistaken for the comma separator.
    const rawSearch = window.location.search;
    const match = rawSearch.match(/[?&]items=([^&]*)/);
    if (match) {
      const parsed = match[1].split(',').map(s => decodeURIComponent(s).trim()).filter(Boolean);
      if (parsed.length > 0) {
        setItems(parsed);
        return;
      }
    }
    // If this page has specific defaultItems (SEO pages), use them (not localStorage)
    if (defaultItems) {
      setItems(defaultItems);
      return;
    }
    // Homepage only: try localStorage
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
          return;
        }
      } catch {}
    }
    setItems(DEFAULT_ITEMS);
  }, [defaultItems]);

  // Sync items to URL (always) and localStorage (homepage only)
  useEffect(() => {
    if (items.length === 0) return;
    if (!defaultItems) {
      localStorage.setItem(LS_KEY, JSON.stringify(items));
    }
    // Encode each item individually so commas inside names don't break the separator
    const itemsParam = items.map(encodeURIComponent).join(',');
    const newUrl = `${window.location.pathname}?items=${itemsParam}`;
    window.history.replaceState({}, '', newUrl);
  }, [items, defaultItems]);

  const handleResult = useCallback((w: string) => {
    setWinner(w);
    setModalOpen(true);
  }, []);

  const handleSpinAgain = () => {
    setModalOpen(false);
    setWinner(null);
    setSpinKey(k => k + 1);
  };

  const handleRemoveAndSpin = () => {
    if (winner) {
      setItems(prev => {
        const idx = prev.indexOf(winner);
        if (idx === -1) return prev;
        return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
      });
    }
    setModalOpen(false);
    setWinner(null);
    setSpinKey(k => k + 1);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-center">
        {/* Wheel */}
        <div className="w-full lg:flex-1 flex justify-center">
          <SpinWheel key={spinKey} items={items} onResult={handleResult} />
        </div>

        {/* Controls */}
        <div className="w-full lg:w-80 bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">Wheel Items</h2>
          <WheelControls items={items} onItemsChange={setItems} />
        </div>
      </div>

      {modalOpen && (
        <ResultModal
          winner={winner}
          onClose={() => setModalOpen(false)}
          onSpinAgain={handleSpinAgain}
          onRemoveAndSpin={handleRemoveAndSpin}
        />
      )}
    </>
  );
}

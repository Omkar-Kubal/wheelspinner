'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import SpinWheel, { SpinWheelHandle } from '@/components/SpinWheel';
import WheelControls from '@/components/WheelControls';
import ResultModal from '@/components/ResultModal';
import Toast from '@/components/Toast';
import { WheelTheme, THEMES, DEFAULT_THEME } from '@/lib/themes';
import { playWinSound } from '@/lib/sounds';

const DEFAULT_ITEMS = ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan'];
const LS_KEY = 'wheelspinner_items';

interface WinnerEntry {
  name: string;
  color: string;
  time: Date;
}

interface WheelPageClientProps {
  defaultItems?: string[];
}

function getRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins === 1) return '1 min ago';
  return `${diffMins} mins ago`;
}

export default function WheelPageClient({ defaultItems }: WheelPageClientProps) {
  const [items, setItems] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [spinKey, setSpinKey] = useState(0);

  // Theme
  const [theme, setTheme] = useState<WheelTheme>(DEFAULT_THEME);

  // Mute
  const [isMuted, setIsMuted] = useState(false);

  // Winner history
  const [winnerHistory, setWinnerHistory] = useState<WinnerEntry[]>([]);
  const [, setTimeTick] = useState(0);

  // Eliminate mode
  const [eliminateMode, setEliminateMode] = useState(false);
  const [originalItems, setOriginalItems] = useState<string[]>([]);
  const [isChampion, setIsChampion] = useState(false);

  // Fullscreen
  const [isFullscreen, setIsFullscreen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Toast
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // SpinWheel ref for image export
  const spinWheelRef = useRef<SpinWheelHandle>(null);

  // Load preferences from localStorage after mount
  useEffect(() => {
    try {
      const savedThemeId = localStorage.getItem('wheelTheme');
      if (savedThemeId) {
        const found = THEMES.find((t) => t.id === savedThemeId);
        if (found) setTheme(found);
      }
    } catch {}

    try {
      setIsMuted(localStorage.getItem('wheelMuted') === 'true');
    } catch {}
  }, []);

  // Load items (priority: URL params → page defaultItems → localStorage → global defaults)
  useEffect(() => {
    const rawSearch = window.location.search;
    const match = rawSearch.match(/[?&]items=([^&]*)/);
    if (match) {
      const parsed = match[1].split(',').map((s) => decodeURIComponent(s).trim()).filter(Boolean);
      if (parsed.length > 0) {
        setItems(parsed);
        return;
      }
    }
    if (defaultItems) {
      setItems(defaultItems);
      return;
    }
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
          return;
        }
      }
    } catch {}
    setItems(DEFAULT_ITEMS);
  }, [defaultItems]);

  // Persist items to localStorage and URL
  useEffect(() => {
    if (items.length === 0) return;
    if (!defaultItems) {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(items));
      } catch {}
    }
    const itemsParam = items.map(encodeURIComponent).join(',');
    const newUrl = `${window.location.pathname}?items=${itemsParam}`;
    window.history.replaceState({}, '', newUrl);
  }, [items, defaultItems]);

  // Tick relative times every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => setTimeTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  // Fullscreen change listener
  useEffect(() => {
    const handleFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFSChange);
    return () => document.removeEventListener('fullscreenchange', handleFSChange);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
  }, []);

  const handleThemeChange = useCallback((t: WheelTheme) => {
    setTheme(t);
    try {
      localStorage.setItem('wheelTheme', t.id);
    } catch {}
  }, []);

  const handleMuteToggle = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('wheelMuted', next ? 'true' : 'false');
      } catch {}
      return next;
    });
  }, []);

  const handleResult = useCallback(
    (w: string, winnerColor: string) => {
      setWinner(w);

      // Add to history (keep last 5)
      setWinnerHistory((prev) => {
        const updated = [...prev, { name: w, color: winnerColor, time: new Date() }];
        return updated.slice(-5);
      });

      const champion = eliminateMode && items.length === 2;

      if (champion) {
        setIsChampion(true);
        confetti({
          particleCount: 250,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#f9ca24', '#f0932b', '#ffdd59', '#ffffff'],
        });
      } else {
        confetti({
          particleCount: 180,
          spread: 80,
          origin: { x: 0.5, y: 0.55 },
          colors: ['#FF6B6B', '#FECA57', '#48DBFB', '#FF9FF3', '#54A0FF', '#1DD1A1'],
        });
      }

      if (!isMuted) {
        playWinSound();
      }

      setModalOpen(true);
    },
    [eliminateMode, items.length, isMuted]
  );

  const eliminateWinner = useCallback(
    (w: string | null) => {
      if (!w || !eliminateMode || isChampion) return;
      setItems((prev) => {
        const idx = prev.indexOf(w);
        if (idx === -1) return prev;
        return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
      });
    },
    [eliminateMode, isChampion]
  );

  const handleClose = useCallback(() => {
    eliminateWinner(winner);
    setModalOpen(false);
    setWinner(null);
    setIsChampion(false);
  }, [eliminateWinner, winner]);

  const handleSpinAgain = useCallback(() => {
    eliminateWinner(winner);
    setModalOpen(false);
    setWinner(null);
    setIsChampion(false);
    setSpinKey((k) => k + 1);
  }, [eliminateWinner, winner]);

  const handleRemoveAndSpin = useCallback(() => {
    if (winner) {
      setItems((prev) => {
        const idx = prev.indexOf(winner);
        if (idx === -1) return prev;
        return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
      });
    }
    setModalOpen(false);
    setWinner(null);
    setIsChampion(false);
    setSpinKey((k) => k + 1);
  }, [winner]);

  const handleStartOver = useCallback(() => {
    setItems(originalItems);
    setModalOpen(false);
    setWinner(null);
    setIsChampion(false);
    setSpinKey((k) => k + 1);
  }, [originalItems]);

  const handleEliminateModeChange = useCallback(
    (val: boolean) => {
      if (val) {
        setOriginalItems([...items]);
      }
      setEliminateMode(val);
    },
    [items]
  );

  // NamesPanel functions
  const handleAddName = useCallback((name: string) => {
    setItems((prev) => [...prev, name]);
  }, []);

  const handleRemoveName = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleClearAll = useCallback(() => {
    setItems([]);
  }, []);

  const handleCopyShareLink = useCallback(() => {
    const itemsParam = items.map(encodeURIComponent).join(',');
    const url = new URL(window.location.href);
    const fullUrl = `${url.origin}${url.pathname}?items=${itemsParam}`;
    navigator.clipboard.writeText(fullUrl);
  }, [items]);

  const handleSaveImage = useCallback(() => {
    spinWheelRef.current?.saveImage();
    showToast('Saved!');
  }, [showToast]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      {/* Fullscreen button */}
      <button
        onClick={toggleFullscreen}
        title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          width: '32px',
          height: '32px',
          borderRadius: '6px',
          background: 'rgba(0,0,0,0.06)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.12)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; }}
      >
        {isFullscreen ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5 0H3v3H0v2h5V0zm6 0v5h5V3h-3V0h-2zM0 11h3v3h2v-5H0v2zm11 3h2v-3h3v-2h-5v5z" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M1 1h5v2H3v3H1V1zm9 0h5v5h-2V3h-3V1zM1 10h2v3h3v2H1v-5zm12 3h-3v2h5v-5h-2v3z" />
          </svg>
        )}
      </button>

      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-12 w-full">
        {/* Wheel section */}
        <div className="flex-shrink-0 flex justify-center w-full lg:w-auto">
          <SpinWheel
            key={spinKey}
            ref={spinWheelRef}
            items={items}
            onSpinEnd={handleResult}
            isSpinning={isSpinning}
            setIsSpinning={setIsSpinning}
            theme={theme}
            onThemeChange={handleThemeChange}
            isMuted={isMuted}
            onMuteToggle={handleMuteToggle}
          />
        </div>

        {/* Controls + history column */}
        <div className="flex-shrink-0 flex flex-col justify-center items-center w-full max-w-sm lg:max-w-none lg:w-auto gap-4">
          <WheelControls
            items={items}
            onAddName={handleAddName}
            onRemoveName={handleRemoveName}
            onClearAll={handleClearAll}
            onCopyShareLink={handleCopyShareLink}
            onSaveImage={handleSaveImage}
            eliminateMode={eliminateMode}
            onEliminateModeChange={handleEliminateModeChange}
          />

          {/* Winner history */}
          {winnerHistory.length > 0 && (
            <div
              className="w-full lg:w-80"
              style={{ paddingTop: '4px' }}
            >
              <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px 0' }}>
                Recent Winners
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[...winnerHistory].reverse().map((entry, i) => (
                  <div
                    key={i}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: entry.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        color: 'white',
                        fontWeight: '600',
                        flexShrink: 0,
                      }}
                    >
                      {entry.name.charAt(0).toUpperCase()}
                    </span>
                    <span
                      style={{
                        fontSize: '13px',
                        color: '#555',
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {entry.name}
                    </span>
                    <span style={{ fontSize: '12px', color: '#aaa', flexShrink: 0 }}>
                      {getRelativeTime(entry.time)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <ResultModal
          winner={winner}
          onClose={handleClose}
          onSpinAgain={handleSpinAgain}
          onRemoveAndSpin={handleRemoveAndSpin}
          isChampion={isChampion}
          onStartOver={handleStartOver}
        />
      )}

      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </div>
  );
}

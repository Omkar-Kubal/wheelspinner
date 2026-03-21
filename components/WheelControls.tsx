'use client';

import { useState, useCallback } from 'react';

interface WheelControlsProps {
  items: string[];
  onItemsChange: (items: string[]) => void;
}

export default function WheelControls({ items, onItemsChange }: WheelControlsProps) {
  const [inputValue, setInputValue] = useState('');
  const [embedVisible, setEmbedVisible] = useState(false);
  const [copyLabel, setCopyLabel] = useState('Copy share link');
  const [embedCopyLabel, setEmbedCopyLabel] = useState('Copy embed code');

  // Build share URL — each item is individually encoded so commas inside names survive the round-trip
  const buildShareUrl = useCallback(() => {
    if (typeof window === 'undefined') return '';
    const itemsParam = items.map(encodeURIComponent).join(',');
    return `${window.location.origin}${window.location.pathname}?items=${itemsParam}`;
  }, [items]);

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    const newItems = [...items, trimmed];
    onItemsChange(newItems);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd();
  };

  const handleDelete = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onItemsChange(newItems);
  };

  const handleClearAll = () => {
    onItemsChange([]);
  };

  const handleCopyShareLink = async () => {
    const url = buildShareUrl();
    await navigator.clipboard.writeText(url);
    setCopyLabel('Copied!');
    setTimeout(() => setCopyLabel('Copy share link'), 2000);
  };

  const handleCopyEmbed = async () => {
    const url = buildShareUrl();
    const iframe = `<iframe src="${url}" width="600" height="700" frameborder="0" style="border-radius:12px;"></iframe>`;
    await navigator.clipboard.writeText(iframe);
    setEmbedCopyLabel('Copied!');
    setTimeout(() => setEmbedCopyLabel('Copy embed code'), 2000);
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Add item */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add an item…"
          className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white 
            placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            transition text-sm"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm
            transition-all duration-150 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-95"
        >
          Add
        </button>
      </div>

      {/* Items list */}
      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
        {items.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">No items yet. Add some above!</p>
        ) : (
          items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-800/60 
                border border-slate-700/60 group hover:border-slate-600 transition-all"
            >
              <span className="text-white text-sm flex-1 truncate">{item}</span>
              <button
                onClick={() => handleDelete(index)}
                aria-label={`Remove ${item}`}
                className="text-slate-500 hover:text-red-400 transition-colors text-xs font-bold px-1.5 py-0.5"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* Clear all */}
      {items.length > 0 && (
        <button
          onClick={handleClearAll}
          className="text-xs text-slate-500 hover:text-red-400 transition-colors self-start"
        >
          Clear all ({items.length} items)
        </button>
      )}

      {/* Divider */}
      <div className="border-t border-slate-700/60" />

      {/* Share */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleCopyShareLink}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
            bg-slate-800 border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-700/80
            text-white text-sm font-medium transition-all duration-150 active:scale-95"
        >
          <span>🔗</span>
          <span>{copyLabel}</span>
        </button>

        <button
          onClick={() => setEmbedVisible(!embedVisible)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
            bg-slate-800 border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-700/80
            text-white text-sm font-medium transition-all duration-150 active:scale-95"
        >
          <span>{'</>'}</span>
          <span>Get embed code</span>
        </button>

        {embedVisible && (
          <div className="mt-1 flex flex-col gap-2">
            <code className="text-xs bg-slate-900 text-slate-300 p-3 rounded-lg border border-slate-700 break-all">
              {`<iframe src="${buildShareUrl()}" width="600" height="700" frameborder="0" style="border-radius:12px;"></iframe>`}
            </code>
            <button
              onClick={handleCopyEmbed}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {embedCopyLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useRef, useEffect, useCallback, useState } from 'react';

const COLORS = [
  '#E63946', '#F4A261', '#2A9D8F', '#457B9D', '#A8DADC',
  '#E9C46A', '#6A4C93', '#F77F00', '#06D6A0', '#EF476F',
];

interface SpinWheelProps {
  items: string[];
  onResult: (winner: string) => void;
}

export default function SpinWheel({ items, onResult }: SpinWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const rotationRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  const drawWheel = useCallback((rotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const radius = cx - 10;

    ctx.clearRect(0, 0, size, size);

    if (items.length === 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Add items to spin!', cx, cy);
      return;
    }

    const segAngle = (2 * Math.PI) / items.length;

    items.forEach((item, i) => {
      const startAngle = rotation + i * segAngle;
      const endAngle = startAngle + segAngle;
      const color = COLORS[i % COLORS.length];

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + segAngle / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      const maxWidth = radius * 0.72;
      const fontSize = Math.max(10, Math.min(16, (radius * 0.18) / Math.max(1, Math.log(items.length + 1))));
      ctx.font = `bold ${fontSize}px Inter, sans-serif`;
      ctx.fillStyle = '#ffffff';

      // Truncate text if needed
      let label = item;
      while (ctx.measureText(label).width > maxWidth && label.length > 3) {
        label = label.slice(0, -1);
      }
      if (label !== item) label = label.slice(0, -1) + '…';

      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 3;
      ctx.fillText(label, radius - 12, 0);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Outer border
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 3;
    ctx.stroke();
  }, [items]);

  useEffect(() => {
    drawWheel(rotationRef.current);
  }, [drawWheel]);

  const handleSpin = () => {
    if (isSpinning || items.length === 0) return;

    setIsSpinning(true);

    const totalRotation = (5 + Math.random() * 5) * Math.PI * 2; // 5-10 full rotations
    const duration = 4000 + Math.random() * 2000; // 4-6 seconds
    const startRotation = rotationRef.current;
    const startTime = performance.now();

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOut(progress);
      rotationRef.current = startRotation + totalRotation * eased;
      drawWheel(rotationRef.current);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        // Determine winner: arrow points right at 3 o'clock (angle 0)
        // We need to find which segment is at angle 0 (right side) relative to rotation
        // The pointer is at the top (12 o'clock = -π/2), so subtract -π/2
        const segAngle = (2 * Math.PI) / items.length;
        const normalized = (((-rotationRef.current - Math.PI / 2) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const winnerIndex = Math.floor(normalized / segAngle) % items.length;
        onResult(items[winnerIndex]);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Pointer */}
      <div className="relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-0 h-0 
          border-l-[12px] border-r-[12px] border-t-[28px] 
          border-l-transparent border-r-transparent border-t-red-500
          drop-shadow-lg"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
        />
        <canvas
          ref={canvasRef}
          width={480}
          height={480}
          className="rounded-full"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning || items.length === 0}
        className="w-full sm:w-auto px-10 py-4 rounded-full text-lg font-bold tracking-wide transition-all duration-200
          bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg
          hover:from-indigo-400 hover:to-purple-500 hover:shadow-indigo-500/30 hover:shadow-xl hover:scale-105
          disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none
          active:scale-95"
      >
        {isSpinning ? 'Spinning…' : 'SPIN'}
      </button>
    </div>
  );
}

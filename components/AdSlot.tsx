'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdSlotProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'leaderboard' | 'vertical' | 'horizontal';
  fullWidthResponsive?: boolean;
  className?: string;
}

const PUBLISHER_ID =
  process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? 'ca-pub-XXXXXXXXXXXXXXXXXX';

const IS_PROD = process.env.NODE_ENV === 'production';

export default function AdSlot({
  slot,
  format = 'auto',
  fullWidthResponsive = true,
  className,
}: AdSlotProps) {
  useEffect(() => {
    if (!IS_PROD) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle not loaded (ad blocker or script missing from layout)
    }
  }, []);

  if (!IS_PROD) {
    const heightMap: Record<string, string> = {
      auto: '90px',
      rectangle: '250px',
      leaderboard: '90px',
      vertical: '600px',
      horizontal: '90px',
    };
    return (
      <div
        className={className}
        style={{
          border: '1px dashed #e0e0e0',
          background: '#fafafa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: heightMap[format] ?? '90px',
          borderRadius: '4px',
        }}
      >
        <span style={{ fontSize: '12px', color: '#ccc' }}>Ad</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={String(fullWidthResponsive)}
      />
    </div>
  );
}

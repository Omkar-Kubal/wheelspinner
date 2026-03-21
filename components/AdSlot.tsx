'use client';

import { useEffect } from 'react';

/**
 * AdSlot — Google AdSense ad unit placeholder.
 *
 * Setup (one-time, in app/layout.tsx <head>):
 *   <script
 *     async
 *     src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=YOUR_PUBLISHER_ID"
 *     crossOrigin="anonymous"
 *   />
 *
 * Usage:
 *   <AdSlot slot="1234567890" />
 *   <AdSlot slot="9876543210" format="rectangle" className="my-4" />
 */

// TODO: Replace with your publisher ID after AdSense approval (format: ca-pub-XXXXXXXXXXXXXXXXXX)
const PUBLISHER_ID = 'ca-pub-XXXXXXXXXXXXXXXXXX';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdSlotProps {
  /** AdSense ad unit slot ID from your AdSense dashboard */
  slot: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  fullWidthResponsive?: boolean;
  className?: string;
}

export default function AdSlot({
  slot,
  format = 'auto',
  fullWidthResponsive = true,
  className,
}: AdSlotProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle not loaded (ad blocker or script missing from layout)
    }
  }, []);

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

import type { Metadata } from 'next';
import WheelPageClient from '@/components/WheelPageClient';
import AdSlot from '@/components/AdSlot';

export const metadata: Metadata = {
  title: 'Spin the Wheel | Free Random Picker',
  description: 'Free spin the wheel tool. Add names, spin, get a random result. No signup needed. Share your wheel with a link.',
};

// ─── Schema data ────────────────────────────────────────────────────────────

const faqItems = [
  {
    q: 'Is this wheel spinner really free?',
    a: 'Yes, completely free. No hidden fees, no premium tier required to spin. We show a small ad to keep the lights on, but the tool itself will always be free.',
  },
  {
    q: 'How do I share my wheel with someone?',
    a: "Click the 'Copy Share Link' button. This copies a URL that has all your wheel items encoded in it. Anyone who opens that link gets the exact same wheel, pre-loaded and ready to spin.",
  },
  {
    q: 'Is the spin result truly random?',
    a: "Yes. We use JavaScript's Math.random() to determine the spin duration and final position. Every segment has an equal probability of winning — there's no weighting or pattern.",
  },
  {
    q: 'Can I use this on my phone or tablet?',
    a: 'Yes. The wheel is fully responsive and works on any screen size. The touch controls work the same as on desktop.',
  },
  {
    q: 'Can I embed the wheel on my website?',
    a: "Yes. Click 'Get Embed Code' in the controls panel. You'll get an iframe snippet you can paste into any website or blog. The embedded wheel is fully functional.",
  },
  {
    q: 'How many names can I add?',
    a: 'Up to 20 names per wheel. For most use cases — classrooms, giveaways, game nights — that\'s plenty. We may increase this limit in the future.',
  },
  {
    q: 'Does the wheel save my names?',
    a: "Your names are saved automatically in your browser's local storage. They'll be there next time you visit on the same device. For permanent saved wheels accessible anywhere, that feature is coming soon.",
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'WheelSpinner',
  url: 'https://randomwheelpicker.io',
  description: 'Free online spin the wheel tool. Add names, spin, get a random result. No signup needed.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

// ─── Use-case cards ──────────────────────────────────────────────────────────

const useCases = [
  {
    emoji: '🎓',
    title: 'Teachers & Classrooms',
    body: 'Pick a random student to answer, assign groups, or decide who presents first. Works great on a projector in fullscreen mode.',
  },
  {
    emoji: '🎮',
    title: 'Game Nights',
    body: "Truth or dare, who goes first, what game to play next — let the wheel make the call so no one argues.",
  },
  {
    emoji: '🎁',
    title: 'Giveaways & Prizes',
    body: 'Run a fair giveaway with a live spin. Share your screen and spin in front of your audience for full transparency.',
  },
  {
    emoji: '🍕',
    title: 'Deciding Anything',
    body: 'Where to eat, what movie to watch, who does the dishes — stop the debate and just spin.',
  },
  {
    emoji: '💼',
    title: 'Teams & Offices',
    body: 'Assign tasks, pick a team lead, decide the order for stand-ups. Fair and instant.',
  },
  {
    emoji: '📱',
    title: 'Content Creators',
    body: 'Pick a challenge, choose a topic, or select a winner from your comments. The live spin makes great content.',
  },
];

const featurePills = [
  'Free forever',
  'No sign-up needed',
  'Shareable links',
  'Works on mobile',
  'Fullscreen mode',
  'Save as image',
  'Custom themes',
  'Instant results',
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* ── Wheel section (UNTOUCHED) ───────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col gap-12">
        {/* Hero */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3 leading-tight">
            Spin the Wheel{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              — Free Random Picker
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Add any items, spin the wheel, and let fate decide. Perfect for picking names, teams, prizes, and more.
          </p>
        </div>

        {/* Wheel + Controls */}
        <WheelPageClient />

        {/* Ad below wheel */}
        <AdSlot slot="1234567890" format="rectangle" className="w-full max-w-xl mx-auto" />
      </div>

      {/* ── SEO content sections ────────────────────────────────────────── */}
      <div className="max-w-[1100px] mx-auto px-6 pb-20">

        {/* ── Section 1: How it works ───────────────────────────────────── */}
        <section className="mt-16">
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '40px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}
          >
            <h2 className="text-xl font-semibold text-center mb-10" style={{ color: '#2d3436' }}>
              How It Works
            </h2>
            <div className="flex flex-col md:flex-row gap-10 md:gap-6">
              {[
                {
                  num: '1',
                  title: 'Add Your Names',
                  desc: 'Type in any names, options, or items you want. Add as many as you need — the wheel adjusts automatically.',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32" style={{ color: '#6C5CE7' }}>
                      <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  ),
                },
                {
                  num: '2',
                  title: 'Spin the Wheel',
                  desc: 'Hit the spin button and watch the wheel fly. The result is completely random — no bias, no patterns, just pure chance.',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32" style={{ color: '#6C5CE7' }}>
                      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ),
                },
                {
                  num: '3',
                  title: 'Share Your Wheel',
                  desc: 'Copy the link and send it to anyone. They get the exact same wheel, ready to spin — no account needed.',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32" style={{ color: '#6C5CE7' }}>
                      <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  ),
                },
              ].map((step, i) => (
                <div key={i} className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                  {/* Number badge */}
                  <span
                    className="flex items-center justify-center font-bold text-sm mb-4"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#f0edff',
                      color: '#6C5CE7',
                      fontSize: '14px',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {step.num}
                  </span>
                  {/* Icon */}
                  {step.icon}
                  {/* Title */}
                  <p style={{ fontSize: '16px', fontWeight: 600, color: '#2d3436', marginTop: '12px', marginBottom: '0' }}>
                    {step.title}
                  </p>
                  {/* Description */}
                  <p style={{ fontSize: '14px', color: '#636e72', lineHeight: 1.6, marginTop: '6px' }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 2: Use cases ──────────────────────────────────────── */}
        <section className="mt-16">
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#2d3436', textAlign: 'center', marginBottom: '8px' }}>
            What People Use It For
          </h2>
          <p style={{ fontSize: '15px', color: '#888', textAlign: 'center', marginBottom: '32px' }}>
            From classrooms to game nights — the wheel works for everything.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {useCases.map((card, i) => (
              <div
                key={i}
                className="use-case-card"
                style={{
                  background: 'white',
                  border: '1px solid #f0f0f0',
                  borderRadius: '14px',
                  padding: '24px',
                }}
              >
                <span style={{ fontSize: '32px', lineHeight: 1 }}>{card.emoji}</span>
                <p style={{ fontSize: '15px', fontWeight: 600, color: '#2d3436', marginTop: '12px', marginBottom: '6px' }}>
                  {card.title}
                </p>
                <p style={{ fontSize: '13px', color: '#636e72', lineHeight: 1.6, margin: 0 }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 3: Features strip ─────────────────────────────────── */}
        <section className="mt-16">
          <div
            style={{
              background: '#f8f6ff',
              padding: '20px 40px',
              borderRadius: '12px',
              display: 'flex',
              flexWrap: 'wrap' as const,
              gap: '12px',
              justifyContent: 'center',
            }}
          >
            {featurePills.map((label) => (
              <span
                key={label}
                style={{
                  background: 'white',
                  border: '1px solid #e8e4ff',
                  borderRadius: '999px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  color: '#5a4fcf',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ color: '#1DD1A1', fontWeight: 700 }}>✓</span>
                {label}
              </span>
            ))}
          </div>
        </section>

        {/* ── Section 4: FAQ accordion ──────────────────────────────────── */}
        <section className="mt-16">
          <h2
            style={{
              fontSize: '22px',
              fontWeight: 600,
              color: '#2d3436',
              textAlign: 'center',
              marginBottom: '32px',
            }}
          >
            Frequently Asked Questions
          </h2>
          <div className="max-w-[720px] mx-auto">
            {faqItems.map((item, i) => (
              <details key={i} className="group border-b border-gray-100">
                <summary
                  className="flex justify-between items-center py-[18px] cursor-pointer select-none"
                  style={{ color: '#2d3436' }}
                >
                  <span
                    className="text-[15px] font-medium group-hover:text-[#6C5CE7] transition-colors duration-150 pr-4"
                  >
                    {item.q}
                  </span>
                  <svg
                    className="faq-chevron flex-shrink-0 transition-transform duration-200"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#888"
                    strokeWidth="2.5"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="pb-4 text-[14px] leading-[1.7]" style={{ color: '#636e72' }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>

      {/* ── JSON-LD schemas ─────────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
    </>
  );
}

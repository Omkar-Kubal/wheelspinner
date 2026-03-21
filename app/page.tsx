import type { Metadata } from 'next';
import WheelPageClient from '@/components/WheelPageClient';

export const metadata: Metadata = {
  title: 'Spin the Wheel | Free Random Picker',
  description: 'Free spin the wheel tool. Add names, spin, get a random result. No signup needed. Share your wheel with a link.',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I use the spin the wheel tool?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Simply add your items in the panel on the right, then click the SPIN button. The wheel will spin and land on a random winner.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I share my wheel with others?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Click "Copy share link" to copy a URL that includes all your items. Anyone who opens the link will see the same wheel.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this tool free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Completely free. No account or signup required.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I embed the wheel on my website?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Click "Get embed code" to get an iframe snippet you can paste into any website.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are the results truly random?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The wheel uses JavaScript\'s Math.random(), which is seeded from system entropy, making the results unpredictable and fair.',
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col gap-12">
        {/* Hero */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 leading-tight">
            Spin the Wheel{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              — Free Random Picker
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Add any items, spin the wheel, and let fate decide. Perfect for picking names, teams, prizes, and more.
          </p>
        </div>

        {/* Wheel + Controls */}
        <WheelPageClient />

        {/* How it works description (SEO) */}
        <section className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-bold text-white mb-3">What is Spin the Wheel?</h2>
          <p className="text-slate-400 leading-relaxed">
            WheelSpinner is a free online spin-the-wheel tool that lets you pick a random item from any list.
            Add names, options, prizes, or anything else — then spin for a fair, random result. No software to install,
            no account required. Share your custom wheel with a unique link, or embed it on your own website.
          </p>
        </section>

        {/* FAQ */}
        <section className="max-w-2xl mx-auto w-full">
          <h2 className="text-xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-4">
            {faqSchema.mainEntity.map((item, i) => (
              <div
                key={i}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-5"
                itemScope
                itemType="https://schema.org/Question"
              >
                <h3
                  className="text-white font-semibold mb-2"
                  itemProp="name"
                >
                  {item.name}
                </h3>
                <div
                  itemScope
                  itemType="https://schema.org/Answer"
                  itemProp="acceptedAnswer"
                >
                  <p className="text-slate-400 text-sm leading-relaxed" itemProp="text">
                    {item.acceptedAnswer.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

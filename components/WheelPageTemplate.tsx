import WheelPageClient from '@/components/WheelPageClient';

interface FaqItem {
  q: string;
  a: string;
}

interface WheelPageTemplateProps {
  h1: string;
  defaultItems: string[];
  description: string;
  faqs: FaqItem[];
}

export default function WheelPageTemplate({ h1, defaultItems, description, faqs }: WheelPageTemplateProps) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col gap-12">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              {h1}
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">{description}</p>
        </div>

        <WheelPageClient defaultItems={defaultItems} />

        <section className="max-w-2xl mx-auto w-full">
          <h2 className="text-xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-5"
                itemScope
                itemType="https://schema.org/Question"
              >
                <h3 className="text-white font-semibold mb-2" itemProp="name">{faq.q}</h3>
                <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  <p className="text-slate-400 text-sm leading-relaxed" itemProp="text">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

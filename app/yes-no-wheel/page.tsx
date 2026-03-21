import type { Metadata } from 'next';
import WheelPageTemplate from '@/components/WheelPageTemplate';

export const metadata: Metadata = {
  title: 'Yes No Wheel | Random Decision Maker',
  description: 'Can\'t decide? Spin the yes or no wheel for an instant random decision. Free and no signup required.',
};

const ITEMS = ['Yes', 'No', 'Maybe'];
const FAQS = [
  { q: 'When should I use a yes or no wheel?', a: 'Use it any time you need to make a quick, unbiased decision between yes, no, or maybe.' },
  { q: 'Can I add more options?', a: 'Yes! You can add options like "Definitely", "Absolutely not", or any custom answer.' },
  { q: 'Is the result random?', a: 'Yes, every spin is completely random and independent of previous results.' },
  { q: 'Can I share the wheel?', a: 'Yes, click "Copy share link" to share your decision wheel with others.' },
  { q: 'Does it work on mobile?', a: 'Fully responsive and works on all devices.' },
];

export default function YesNoWheelPage() {
  return (
    <WheelPageTemplate
      h1="Yes or No Wheel"
      defaultItems={ITEMS}
      description="Spin the yes or no wheel to make a random decision instantly. Add your own options or stick with Yes, No, and Maybe."
      faqs={FAQS}
    />
  );
}

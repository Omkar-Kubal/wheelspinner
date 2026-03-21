import type { Metadata } from 'next';
import WheelPageTemplate from '@/components/WheelPageTemplate';

export const metadata: Metadata = {
  title: 'Truth or Dare Wheel | Random Picker',
  description: 'Free truth or dare wheel. Spin to get a random Truth or Dare challenge. No signup needed.',
};

const ITEMS = ['Truth', 'Dare', 'Truth', 'Dare', 'Wild card'];
const FAQS = [
  { q: 'How do I use the truth or dare wheel?', a: 'Spin the wheel. If it lands on "Truth", the current player must answer an honest question. If "Dare", they must complete a challenge.' },
  { q: 'What is "Wild card"?', a: 'Wild card means the player can choose between Truth or Dare — or make up their own challenge.' },
  { q: 'Can I customize the options?', a: 'Yes! Add or remove options like "Double Dare", "Skip", or any custom challenge.' },
  { q: 'How many players can play?', a: 'Any number of players can participate — just take turns spinning in order.' },
  { q: 'Can I share the truth or dare wheel?', a: 'Yes, use "Copy share link" to send your configured wheel to your friends.' },
];

export default function TruthOrDareWheelPage() {
  return (
    <WheelPageTemplate
      h1="Truth or Dare Wheel"
      defaultItems={ITEMS}
      description="Spin the truth or dare wheel to randomly decide who gets a Truth or Dare challenge. Fun for parties and game nights."
      faqs={FAQS}
    />
  );
}

import type { Metadata } from 'next';
import WheelPageTemplate from '@/components/WheelPageTemplate';

export const metadata: Metadata = {
  title: 'Wheel of Names | Free Spin the Wheel',
  description: 'Free wheel of names spinner. Add any names, spin, and get a random result. No signup needed.',
};

const ITEMS = ['Name 1', 'Name 2', 'Name 3', 'Name 4', 'Name 5'];
const FAQS = [
  { q: 'What is a wheel of names?', a: 'A wheel of names is a random name selector that spins and lands on a name chosen at random.' },
  { q: 'How many names can I add?', a: 'There is no hard limit. Add as many names as you need.' },
  { q: 'Can I remove the winner after each spin?', a: 'Yes! After each spin, click "Remove & spin again" to eliminate the winner and keep going.' },
  { q: 'Can I share my wheel of names?', a: 'Yes, use the "Copy share link" button to get a URL with all your names ready to spin.' },
  { q: 'Is it free?', a: 'Completely free, no account or payment required.' },
];

export default function WheelOfNamesPage() {
  return (
    <WheelPageTemplate
      h1="Wheel of Names"
      defaultItems={ITEMS}
      description="Spin the wheel of names to pick a random name from your list. Great for raffles, classrooms, and team decisions."
      faqs={FAQS}
    />
  );
}

import type { Metadata } from 'next';
import WheelPageTemplate from '@/components/WheelPageTemplate';

export const metadata: Metadata = {
  title: 'Random Name Picker | Spin the Wheel',
  description: 'Pick a random name by spinning the wheel. Free online random name picker — no signup required.',
};

const ITEMS = ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan'];
const FAQS = [
  { q: 'How do I pick a random name?', a: 'Add the names you want to choose from, then click SPIN. The wheel will randomly land on one.' },
  { q: 'Can I add my own names?', a: 'Yes! Edit the list in the panel and add as many names as you like.' },
  { q: 'Is the name picker fair?', a: 'Each name has an equal chance of being selected on every spin.' },
  { q: 'Can I share my name list?', a: 'Click "Copy share link" to get a URL with all your names pre-loaded.' },
  { q: 'Does it work on mobile?', a: 'Yes, the random name picker is fully responsive and works on phones and tablets.' },
];

export default function RandomNamePickerPage() {
  return (
    <WheelPageTemplate
      h1="Random Name Picker"
      defaultItems={ITEMS}
      description="Add names to the wheel and spin to pick one at random. Perfect for giveaways, classroom activities, and group decisions."
      faqs={FAQS}
    />
  );
}

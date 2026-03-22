import type { Metadata } from 'next';
import WheelPageTemplate from '@/components/WheelPageTemplate';

export const metadata: Metadata = {
  title: 'Random Team Picker | Split Into Teams',
  description: 'Use the random team picker wheel to split players into fair, random teams. Free with no signup.',
};

const ITEMS = ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5', 'Player 6'];
const FAQS = [
  { q: 'How do I use this to pick teams?', a: 'Add all player names, then spin repeatedly. The first half of results go to Team A, the rest to Team B.' },
  { q: 'Can I pick more than two teams?', a: 'Yes! Spin and assign each result to your teams in order.' },
  { q: 'Is the team selection random?', a: 'Yes, every spin is fully random and unbiased.' },
  { q: 'Can I share the player list?', a: 'Yes, use "Copy share link" to share your team picker with others.' },
  { q: 'Does it work for sports?', a: 'Perfect for soccer, basketball, trivia nights, or any group sport or game.' },
];

export default function TeamPickerPage() {
  return (
    <WheelPageTemplate
      h1="Random Team Picker"
      defaultItems={ITEMS}
      description="Spin the wheel to split players into random teams quickly and fairly. Great for sports, games, and group activities."
      faqs={FAQS}
    />
  );
}

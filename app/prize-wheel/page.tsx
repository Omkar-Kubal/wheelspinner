import type { Metadata } from 'next';
import WheelPageTemplate from '@/components/WheelPageTemplate';

export const metadata: Metadata = {
  title: 'Prize Wheel Spinner | Free Online',
  description: 'Free online prize wheel spinner. Add your prizes, spin, and award a winner. No signup needed.',
};

const ITEMS = ['Prize 1', 'Prize 2', 'Prize 3', 'No prize', 'Try again', 'Bonus!'];
const FAQS = [
  { q: 'What can I use a prize wheel for?', a: 'Prize wheels are great for giveaways, promotions, trade shows, classroom rewards, and office events.' },
  { q: 'Can I customize the prizes?', a: 'Yes! Edit the list to include your own prizes, discount codes, or any other rewards.' },
  { q: 'Can I add "No prize" or "Try again" options?', a: 'Yes — add as many or as few outcome options as you like.' },
  { q: 'Can I share the prize wheel?', a: 'Yes, use "Copy share link" to share your configured prize wheel with participants.' },
  { q: 'Is the spin result tamper-proof?', a: 'The spin uses JavaScript\'s Math.random() — it cannot be manipulated by any player.' },
];

export default function PrizeWheelPage() {
  return (
    <WheelPageTemplate
      h1="Prize Wheel Spinner"
      defaultItems={ITEMS}
      description="Spin the prize wheel to award random prizes at events, giveaways, or classroom activities. Customize prizes and share with participants."
      faqs={FAQS}
    />
  );
}

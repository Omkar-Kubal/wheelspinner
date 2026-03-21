import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'About WheelSpinner — a free spin the wheel and random picker tool.',
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-6">About WheelSpinner</h1>
      <p className="text-slate-400 leading-relaxed text-lg">
        WheelSpinner is a free, no-account-needed spin-the-wheel tool built for anyone who needs to make a random,
        fair decision. Whether you&apos;re a teacher picking a student to answer a question, a group of friends deciding
        where to eat, or a host running a giveaway — WheelSpinner makes it fast, visual, and fun. Add your items,
        spin the wheel, and get a result instantly. You can share any wheel via a link or embed it on your own website.
      </p>
    </div>
  );
}

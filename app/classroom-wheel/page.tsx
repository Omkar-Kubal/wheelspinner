import type { Metadata } from 'next';
import WheelPageTemplate from '@/components/WheelPageTemplate';

export const metadata: Metadata = {
  title: 'Random Student Picker for Teachers',
  description: 'Free classroom wheel to pick a random student. Perfect for teachers who need a fair, fun way to call on students.',
};

const ITEMS = ['Student 1', 'Student 2', 'Student 3', 'Student 4', 'Student 5'];
const FAQS = [
  { q: 'How do teachers use this tool?', a: 'Add all your students\' names, spin, and the wheel picks one student at random to answer or participate.' },
  { q: 'Is it fair for students?', a: 'Yes, each student has an equal probability of being selected on every spin.' },
  { q: 'Can I save my class list?', a: 'Yes, your student names are saved in localStorage and in the URL so you don\'t need to re-enter them.' },
  { q: 'Can I remove a student once selected?', a: 'Yes, use "Remove & spin again" to ensure everyone gets a turn before anyone is picked twice.' },
  { q: 'Does it work on a classroom projector?', a: 'Absolutely. The wheel is large and readable on any screen or projector.' },
];

export default function ClassroomWheelPage() {
  return (
    <WheelPageTemplate
      h1="Random Student Picker"
      defaultItems={ITEMS}
      description="A classroom wheel for teachers. Add your students' names and spin to call on one at random — fair and fun."
      faqs={FAQS}
    />
  );
}

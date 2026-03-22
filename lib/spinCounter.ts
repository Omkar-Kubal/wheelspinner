import { db } from './firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

const STATS_DOC = () => doc(db, 'stats', 'global');

/**
 * Increments the global spin counter in Firestore.
 * Fails silently — never throws.
 */
export async function incrementSpinCount(): Promise<void> {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) return;
  try {
    const ref = STATS_DOC();
    await updateDoc(ref, { totalSpins: increment(1) });
  } catch {
    // Silently ignore — counter is non-critical
  }
}

/**
 * Reads the global spin counter from Firestore.
 * Returns 0 on any failure.
 */
export async function getSpinCount(): Promise<number> {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) return 0;
  try {
    const ref = STATS_DOC();
    const snap = await getDoc(ref);
    if (!snap.exists()) return 0;
    return (snap.data().totalSpins as number) ?? 0;
  } catch {
    return 0;
  }
}

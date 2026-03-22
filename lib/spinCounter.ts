import { db } from './firebase';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';

const COUNTER_DOC = 'counters/global';

/**
 * Increments the global spin count in Firestore.
 * Returns silently without throwing if Firebase is not initialized.
 */
export async function incrementSpinCount(): Promise<void> {
  if (!db) {
    return;
  }

  try {
    await setDoc(
      doc(db, COUNTER_DOC),
      { spinCount: increment(1) },
      { merge: true }
    );
  } catch (error) {
    console.warn('[spinCounter] Failed to increment spin count:', error);
  }
}

/**
 * Retrieves the current global spin count from Firestore.
 * Returns 0 silently if Firebase is not initialized or the document doesn't exist.
 */
export async function getSpinCount(): Promise<number> {
  if (!db) {
    return 0;
  }

  try {
    const snapshot = await getDoc(doc(db, COUNTER_DOC));
    if (!snapshot.exists()) return 0;
    const data = snapshot.data();
    return typeof data?.spinCount === 'number' ? data.spinCount : 0;
  } catch (error) {
    console.warn('[spinCounter] Failed to get spin count:', error);
    return 0;
  }
}

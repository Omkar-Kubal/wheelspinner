import type { Timestamp } from 'firebase/firestore';

export interface WheelConfig {
  id: string;
  name: string;
  items: string[];
  createdAt: Timestamp;
}

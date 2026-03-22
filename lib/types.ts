export interface WheelConfig {
  id: string;
  name: string;
  items: string[];
  createdAt: Date;
  spinCount: number;
}

export interface SpinResult {
  winner: string;
  timestamp: Date;
  wheelItems: string[];
}

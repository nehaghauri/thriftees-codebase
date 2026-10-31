import type { Condition } from '../types';

export const CONDITIONS: { label: Condition; level: number; note: string }[] = [
  { label: 'Like New', level: 4, note: 'Worn once or never. No visible wear.' },
  { label: 'Excellent', level: 3, note: 'Very light wear. Looks great on.' },
  { label: 'Good', level: 2, note: 'Some honest wear like slight fading or soft pilling, noted in the description.' },
  { label: 'Gently Used', level: 1, note: 'Visible character such as fading or small marks. Priced to match.' },
];

export const conditionInfo = (c: Condition) => CONDITIONS.find((x) => x.label === c)!;

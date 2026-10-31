import type { Collection } from '../types';

export const COLLECTIONS: Collection[] = [
  {
    id: 'denim-days',
    title: 'Denim days',
    blurb: 'Jeans, jackets and shorts with the right amount of fade.',
    tone: 'sky',
    productIds: ['thr-009', 'thr-011', 'thr-012', 'thr-015', 'thr-032', 'thr-033', 'thr-036'],
  },
  {
    id: 'cozy-club',
    title: 'Cozy club',
    blurb: 'Knits, hoodies and shawls for cold mornings.',
    tone: 'pink',
    productIds: ['thr-005', 'thr-006', 'thr-007', 'thr-008', 'thr-025', 'thr-026', 'thr-027', 'thr-028', 'thr-029', 'thr-039', 'thr-040'],
  },
  {
    id: 'desk-to-dinner',
    title: 'Desk to dinner',
    blurb: 'Smart pieces that go from the office to the evening.',
    tone: 'butter',
    productIds: ['thr-003', 'thr-013', 'thr-014', 'thr-021', 'thr-022', 'thr-034', 'thr-037', 'thr-038'],
  },
  {
    id: 'everyday-basics',
    title: 'Everyday basics',
    blurb: 'Tees, caps and totes you will reach for on repeat.',
    tone: 'mint',
    productIds: ['thr-001', 'thr-002', 'thr-017', 'thr-019', 'thr-020', 'thr-023', 'thr-024', 'thr-041'],
  },
];

export const getCollection = (id: string | null | undefined) => COLLECTIONS.find((c) => c.id === id);

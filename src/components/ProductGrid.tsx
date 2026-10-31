import type { Product } from '../types';
import ProductCard from './ProductCard';

interface Props {
  products: Product[];
  /** 3 or 4 columns on large screens */
  columns?: 3 | 4;
}

export default function ProductGrid({ products, columns = 4 }: Props) {
  const cols = columns === 3 ? 'xl:grid-cols-3' : 'xl:grid-cols-4';
  return (
    <div className={`grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 md:gap-x-5 ${cols}`}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

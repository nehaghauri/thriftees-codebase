import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import type { Product } from '../types';
import { applyFilters, countActiveFilters, EMPTY_FILTERS, getPriceBounds, getSizeOptions, SORT_OPTIONS, sortProducts, type Filters, type SortKey } from '../utils/products';
import FilterPanel from './FilterPanel';
import ProductGrid from './ProductGrid';

interface Props {
  products: Product[];
  initialSort?: SortKey;
  empty?: ReactNode;
}

/** Product count, sorting, filters and the grid: shared by category pages and the shop/search page. */
export default function ProductBrowser({ products, initialSort = 'featured', empty }: Props) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>(initialSort);
  const [showFilters, setShowFilters] = useState(false);

  const sizeOptions = useMemo(() => getSizeOptions(products), [products]);
  const bounds = useMemo(() => getPriceBounds(products), [products]);
  const visible = useMemo(() => sortProducts(applyFilters(products, filters), sort), [products, filters, sort]);
  const activeCount = countActiveFilters(filters);

  if (products.length === 0) return <>{empty}</>;

  return (
    <div className="grid gap-8 lg:grid-cols-[250px_1fr] lg:gap-10">
      <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
        <div className="lg:sticky lg:top-24">
          <FilterPanel sizeOptions={sizeOptions} filters={filters} onChange={setFilters} priceBounds={bounds} />
        </div>
      </aside>

      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold" aria-live="polite">
            {visible.length} {visible.length === 1 ? 'piece' : 'pieces'}
            {visible.length !== products.length && <span className="font-normal text-ink-soft"> of {products.length}</span>}
          </p>
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={() => setShowFilters((s) => !s)} aria-expanded={showFilters} className="btn btn-light btn-sm lg:hidden">
              <SlidersHorizontal size={15} aria-hidden /> Filters{activeCount > 0 ? ` (${activeCount})` : ''}
            </button>
            <div className="relative">
              <label htmlFor="sort" className="sr-only">Sort by</label>
              <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="cursor-pointer appearance-none rounded-full border-2 border-ink bg-white py-2 pl-4 pr-10 text-[13px] font-semibold hover:bg-butter">
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" aria-hidden />
            </div>
          </div>
        </div>

        {visible.length > 0 ? (
          <ProductGrid products={visible} columns={3} />
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-ink/40 bg-white/60 px-6 py-16 text-center">
            <p className="font-display text-2xl font-bold">Nothing matches those filters</p>
            <p className="mt-1.5 text-ink-soft">Try widening your price range or clearing a size.</p>
            <button type="button" className="btn btn-dark mt-5" onClick={() => setFilters(EMPTY_FILTERS)}>
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

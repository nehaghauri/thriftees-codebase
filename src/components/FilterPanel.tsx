import { RotateCcw } from 'lucide-react';
import type { Filters } from '../utils/products';
import { countActiveFilters, EMPTY_FILTERS } from '../utils/products';

interface Props {
  sizeOptions: string[];
  filters: Filters;
  onChange: (next: Filters) => void;
  priceBounds: { min: number; max: number };
}

export default function FilterPanel({ sizeOptions, filters, onChange, priceBounds }: Props) {
  const active = countActiveFilters(filters);
  const toggleSize = (s: string) =>
    onChange({ ...filters, sizes: filters.sizes.includes(s) ? filters.sizes.filter((x) => x !== s) : [...filters.sizes, s] });
  const num = (v: string) => (v === '' ? null : Math.max(0, Number(v)));

  return (
    <div className="space-y-6 rounded-2xl border-2 border-ink bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-extrabold">Filters</h2>
        {active > 0 && (
          <button type="button" onClick={() => onChange(EMPTY_FILTERS)} className="flex items-center gap-1 text-[13px] font-semibold text-tomato hover:underline">
            <RotateCcw size={14} aria-hidden /> Clear all
          </button>
        )}
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-bold">Size</legend>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((s) => (
            <button key={s} type="button" className="chip" aria-pressed={filters.sizes.includes(s)} onClick={() => toggleSize(s)}>
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-bold">Price (PKR)</legend>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="min-price">Minimum price</label>
          <input id="min-price" type="number" inputMode="numeric" min={0} className="field !px-3 !py-2 text-sm" placeholder={String(priceBounds.min)} value={filters.minPrice ?? ''} onChange={(e) => onChange({ ...filters, minPrice: num(e.target.value) })} />
          <span aria-hidden>to</span>
          <label className="sr-only" htmlFor="max-price">Maximum price</label>
          <input id="max-price" type="number" inputMode="numeric" min={0} className="field !px-3 !py-2 text-sm" placeholder={String(priceBounds.max)} value={filters.maxPrice ?? ''} onChange={(e) => onChange({ ...filters, maxPrice: num(e.target.value) })} />
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-bold">Availability</legend>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium">
          <input type="checkbox" className="h-5 w-5 cursor-pointer accent-tomato" checked={filters.inStockOnly} onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })} />
          In stock only
        </label>
      </fieldset>
    </div>
  );
}

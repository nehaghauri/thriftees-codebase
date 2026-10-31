import { Search } from 'lucide-react';
import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategory } from '../data/categories';
import { useClickOutside } from '../hooks/useClickOutside';
import { formatPKR } from '../utils/format';
import { searchCategories, searchProducts } from '../utils/products';

interface Option {
  key: string;
  to: string;
  title: string;
  meta?: string;
  image?: string;
}

interface Props {
  className?: string;
  autoFocus?: boolean;
  onDone?: () => void;
}

export default function SearchBar({ className = '', autoFocus = false, onDone }: Props) {
  const navigate = useNavigate();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  useClickOutside(wrapRef, () => setOpen(false), open);

  const q = query.trim();
  const options = useMemo<Option[]>(() => {
    if (!q) return [];
    const products = searchProducts(q).slice(0, 5).map((p) => ({
      key: p.id,
      to: `/product/${p.id}`,
      title: p.name,
      meta: `${getCategory(p.categorySlug)?.label ?? ''}, ${formatPKR(p.price)}`,
      image: p.images[0],
    }));
    const cats = searchCategories(q).map((c) => ({
      key: c.slug,
      to: `/category/${c.slug}`,
      title: `${c.gender === 'men' ? 'Men' : 'Women'}'s ${c.label}`,
      meta: 'Category',
    }));
    return [...products, ...cats, { key: 'all', to: `/shop?q=${encodeURIComponent(q)}`, title: `See all results for "${q}"` }];
  }, [q]);

  const go = (to: string) => {
    navigate(to);
    setOpen(false);
    setQuery('');
    setActive(-1);
    onDone?.();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (a + 1) % Math.max(options.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a <= 0 ? options.length - 1 : a - 1));
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (active >= 0 && options[active]) return go(options[active].to);
    if (q) go(`/shop?q=${encodeURIComponent(q)}`);
  };

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <form role="search" onSubmit={submit}>
        <label htmlFor="site-search" className="sr-only">
          Search Thriftees
        </label>
        <div className="relative">
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
          <input
            id="site-search"
            type="search"
            autoComplete="off"
            autoFocus={autoFocus}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setActive(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Search jeans, hoodies, dresses"
            role="combobox"
            aria-expanded={open && options.length > 0}
            aria-controls="search-options"
            aria-activedescendant={active >= 0 ? `search-opt-${active}` : undefined}
            className="w-full rounded-full border-2 border-ink bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-ink-faint focus:outline-none focus:shadow-[0_0_0_4px_#F7D94C]"
          />
        </div>
      </form>

      {open && options.length > 0 && (
        <ul id="search-options" role="listbox" className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-pop-lg">
          {options.map((o, i) => (
            <li key={o.key} id={`search-opt-${i}`} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => go(o.to)}
                className={`flex w-full items-center gap-3 px-3 py-2 text-left ${i === active ? 'bg-butter' : ''}`}
              >
                {o.image ? (
                  <img src={o.image} alt="" className="h-12 w-10 shrink-0 rounded-md border border-ink object-cover" />
                ) : o.key === 'all' ? null : (
                  <span className="flex h-12 w-10 shrink-0 items-center justify-center rounded-md border border-ink bg-mint text-xs font-bold">#</span>
                )}
                <span className="min-w-0">
                  <span className={`block truncate text-sm ${o.key === 'all' ? 'font-bold' : 'font-semibold'}`}>{o.title}</span>
                  {o.meta && <span className="block text-xs text-ink-soft">{o.meta}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

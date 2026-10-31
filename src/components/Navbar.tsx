import { ChevronDown, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { categoriesFor } from '../data/categories';
import { SHIPPING } from '../data/site';
import { useCart } from '../context/CartContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import type { Gender } from '../types';
import { formatPKR } from '../utils/format';
import { countInCategory } from '../utils/products';
import SearchBar from './SearchBar';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" aria-label="Thriftees home" className={`group inline-flex items-center gap-2 ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-butter transition group-hover:rotate-[-12deg]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#151B3B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 6.5a2 2 0 1 1 2 2c-1 .4-2 1-2 2v1" />
          <path d="M12 11.5 3.5 17.2c-.9.6-.5 2 .6 2h15.8c1.100 0 1.500-1.400.6-2L12 11.500Z" />
        </svg>
      </span>
      <span className="font-display text-[26px] font-extrabold lowercase leading-none tracking-tight">thriftees</span>
    </Link>
  );
}

function MegaMenu({ gender, label }: { gender: Gender; label: string }) {
  const cats = categoriesFor(gender);
  return (
    <li className="group relative">
      <NavLink to={`/${gender}`} className={({ isActive }) => `flex items-center gap-1 rounded-full px-3.5 py-2 text-[15px] font-semibold transition hover:bg-butter ${isActive ? 'bg-butter' : ''}`}>
        {label}
        <ChevronDown size={15} className="transition group-hover:rotate-180" aria-hidden />
      </NavLink>
      <div className="invisible absolute left-0 top-full z-50 w-[440px] pt-3 opacity-0 transition duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <div className="rounded-2xl border-2 border-ink bg-white p-4 shadow-pop-lg">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5">
            {cats.map((c) => (
              <li key={c.slug}>
                <Link to={`/category/${c.slug}`} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-butter">
                  {c.label}
                  <span className="font-mono text-[11px] text-ink-faint">{countInCategory(c.slug)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link to={`/${gender}`} className="btn btn-dark btn-sm mt-3 w-full">
            Shop all {label.toLowerCase()}
          </Link>
        </div>
      </div>
    </li>
  );
}

export default function Navbar() {
  const { itemCount } = useCart();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  useBodyScrollLock(mobileOpen);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="bg-ink px-4 py-2 text-center text-[13px] font-medium text-paper">
        Free delivery over {formatPKR(SHIPPING.freeOver)}. Pay cash on delivery.
      </div>
      <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/95 backdrop-blur">
        <div className="container-x flex h-[68px] items-center gap-3">
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-white lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <Logo />

          <nav aria-label="Main" className="ml-6 hidden lg:block">
            <ul className="flex items-center gap-1">
              <MegaMenu gender="women" label="Women" />
              <MegaMenu gender="men" label="Men" />
              <li>
                <Link to="/shop?sort=newest" className="rounded-full px-3.5 py-2 text-[15px] font-semibold transition hover:bg-butter">
                  New in
                </Link>
              </li>
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2.5">
            <SearchBar className="hidden w-[300px] lg:block xl:w-[360px]" />
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-white lg:hidden" onClick={() => setSearchOpen((s) => !s)} aria-label={searchOpen ? 'Close search' : 'Open search'} aria-expanded={searchOpen}>
              {searchOpen ? <X size={19} /> : <Search size={19} />}
            </button>
            <Link to="/cart" className="relative flex h-10 items-center gap-2 rounded-full border-2 border-ink bg-butter px-3.5 text-sm font-bold transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop" aria-label={`Cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}>
              <ShoppingBag size={19} aria-hidden />
              <span key={itemCount} className={`min-w-[1ch] tabular-nums ${itemCount > 0 ? 'animate-pop' : ''}`}>
                {itemCount}
              </span>
            </Link>
          </div>
        </div>
        {searchOpen && (
          <div className="container-x pb-3 lg:hidden">
            <SearchBar autoFocus onDone={() => setSearchOpen(false)} />
          </div>
        )}
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-paper" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="container-x flex h-[68px] shrink-0 items-center justify-between border-b-2 border-ink">
            <Logo />
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-white" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X size={20} />
            </button>
          </div>
          <div className="container-x space-y-3 py-5">
            <SearchBar onDone={() => setMobileOpen(false)} />
            {(['women', 'men'] as Gender[]).map((g) => (
              <details key={g} className="group rounded-2xl border-2 border-ink bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5 font-display text-xl font-bold">
                  {g === 'women' ? 'Women' : 'Men'}
                  <ChevronDown size={20} className="transition group-open:rotate-180" aria-hidden />
                </summary>
                <ul className="grid grid-cols-2 gap-1 border-t-2 border-ink p-3">
                  <li className="col-span-2">
                    <Link to={`/${g}`} className="block rounded-lg bg-butter px-3 py-2 text-sm font-bold">
                      Shop all {g}
                    </Link>
                  </li>
                  {categoriesFor(g).map((c) => (
                    <li key={c.slug}>
                      <Link to={`/category/${c.slug}`} className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-paper-deep">
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
            <Link to="/shop?sort=newest" className="block rounded-2xl border-2 border-ink bg-white px-4 py-3.5 font-display text-xl font-bold">
              New in
            </Link>
            <Link to="/cart" className="btn btn-primary w-full">
              View cart ({itemCount})
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

import { X } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { formatPKR } from '../utils/format';
import CartItem from './CartItem';
import FreeShippingBar from './FreeShippingBar';

export default function CartDrawer() {
  const { drawerOpen, closeDrawer, lines, itemCount, subtotal } = useCart();
  useBodyScrollLock(drawerOpen);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeDrawer();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen, closeDrawer]);

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 animate-fadein bg-ink/50" onClick={closeDrawer} aria-hidden />
      <aside role="dialog" aria-modal="true" aria-label="Your cart" className="absolute right-0 top-0 flex h-full w-full max-w-md animate-slidein flex-col border-l-2 border-ink bg-paper">
        <div className="flex items-center justify-between border-b-2 border-ink px-5 py-4">
          <h2 className="font-display text-2xl font-extrabold">
            Your cart <span className="text-ink-soft">({itemCount})</span>
          </h2>
          <button type="button" onClick={closeDrawer} aria-label="Close cart" className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-white transition hover:bg-butter" autoFocus>
            <X size={18} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="font-display text-xl font-bold">Your cart is empty</p>
            <p className="text-ink-soft">Nothing here yet. Let us fix that.</p>
            <Link to="/shop" className="btn btn-primary">
              Browse everything
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y-2 divide-ink/10 overflow-y-auto px-5">
              {lines.map((l) => (
                <CartItem key={l.key} line={l} compact />
              ))}
            </ul>
            <div className="space-y-3 border-t-2 border-ink bg-white p-5">
              <FreeShippingBar subtotal={subtotal} />
              <div className="flex items-baseline justify-between">
                <span className="font-semibold">Subtotal</span>
                <span className="font-mono text-lg font-medium">{formatPKR(subtotal)}</span>
              </div>
              <p className="text-[12px] text-ink-soft">Shipping is calculated in your cart.</p>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/cart" className="btn btn-light">
                  View cart
                </Link>
                <Link to="/checkout" className="btn btn-primary">
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

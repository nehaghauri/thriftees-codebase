import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import CartItem from '../components/CartItem';
import FreeShippingBar from '../components/FreeShippingBar';
import OrderSummary from '../components/OrderSummary';
import { useCart } from '../context/CartContext';
import { usePageTitle } from '../hooks/usePageTitle';

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <svg width="120" height="96" viewBox="0 0 120 96" fill="none" stroke="#151B3B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M10 30h100l-8 56H18Z" fill="#F7D94C" />
        <path d="M40 30V22a20 20 0 0 1 40 0v8" />
        <path d="M46 56q14 12 28 0" />
      </svg>
      <h1 className="mt-6 text-4xl font-extrabold">{title}</h1>
      <p className="mt-2 text-ink-soft">{text}</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link to="/women" className="btn btn-primary">Shop women</Link>
        <Link to="/men" className="btn btn-light">Shop men</Link>
      </div>
    </div>
  );
}

export default function CartPage() {
  usePageTitle('Your cart');
  const { lines, itemCount, subtotal, shipping, total, clearCart } = useCart();

  if (lines.length === 0) {
    return (
      <div className="container-x py-10">
        <EmptyState title="Your cart is empty" text="Nothing here yet. Go find something with a past life." />
      </div>
    );
  }

  return (
    <div className="container-x py-8 sm:py-10">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />
      <div className="mb-8 mt-5 flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-5xl font-extrabold sm:text-6xl">
          Your cart <span className="text-ink-faint">({itemCount})</span>
        </h1>
        <button type="button" onClick={clearCart} className="text-sm font-semibold text-ink-soft underline underline-offset-4 hover:text-tomato">
          Clear cart
        </button>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_390px] lg:gap-12">
        <div>
          <ul className="divide-y-2 divide-ink/10 rounded-2xl border-2 border-ink bg-white px-4 sm:px-6">
            {lines.map((l) => (
              <CartItem key={l.key} line={l} />
            ))}
          </ul>
          <Link to="/shop" className="mt-6 inline-flex items-center gap-2 font-semibold">
            <ArrowLeft size={16} aria-hidden />
            <span className="link-u">Continue shopping</span>
          </Link>
        </div>

        <div className="space-y-4 lg:sticky lg:top-24">
          <FreeShippingBar subtotal={subtotal} />
          <OrderSummary subtotal={subtotal} shipping={shipping} total={total}>
            <Link to="/checkout" className="btn btn-primary btn-lg w-full">
              Proceed to checkout
            </Link>
            <p className="mt-3 text-center text-[13px] text-ink-soft">Cash on delivery. No payment needed today.</p>
          </OrderSummary>
        </div>
      </div>
    </div>
  );
}

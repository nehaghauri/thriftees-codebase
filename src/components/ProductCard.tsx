import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';
import { discountPercent, formatPKR } from '../utils/format';
import { isNewArrival } from '../utils/products';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, quantityInCart } = useCart();
  const [note, setNote] = useState<string | null>(null);
  const soldOut = product.stock <= 0;
  const left = product.stock - quantityInCart(product.id);
  const off = discountPercent(product.price, product.originalPrice);
  const to = `/product/${product.id}`;

  const quickAdd = (size: string) => {
    const res = addItem(product, size);
    setNote(res.ok ? null : res.reason);
  };

  return (
    <article className="product-card group relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border-2 border-ink bg-white transition duration-200 group-hover:shadow-pop">
        <Link to={to} className="block h-full" aria-label={`View ${product.name}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className={`img-a absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${soldOut ? 'opacity-60 grayscale' : ''}`}
          />
          {product.images[1] && (
            <img src={product.images[1]} alt="" aria-hidden loading="lazy" className="img-b absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300" />
          )}
        </Link>

        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {soldOut && <span className="sticker bg-ink text-paper">Sold out</span>}
          {!soldOut && isNewArrival(product) && <span className="sticker bg-butter">New</span>}
          {!soldOut && off > 0 && <span className="sticker bg-tomato text-white">-{off}%</span>}
        </div>

        {!soldOut && (
          <div className="quick-add absolute inset-x-2.5 bottom-2.5 rounded-xl border-2 border-ink bg-paper p-2.5 shadow-pop transition duration-200">
            {left <= 0 ? (
              <p className="py-1 text-center text-[13px] font-semibold">
                In your cart already.{' '}
                <Link to="/cart" className="link-u">
                  View cart
                </Link>
              </p>
            ) : (
              <>
                <p className="mb-1.5 text-[12px] font-semibold text-ink-soft">{note ?? (product.sizes.length > 1 ? 'Quick add, pick a size' : 'Quick add')}</p>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map((s) => (
                    <button key={s} type="button" onClick={() => quickAdd(s)} className="chip !min-w-0 !px-3 !py-1 !text-[13px]">
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-3">
        <Link to={to} className="block font-display text-[17px] font-bold leading-snug hover:text-tomato">
          {product.name}
        </Link>
        <p className="mt-0.5 text-[13px] text-ink-soft">
          {product.condition}, {product.sizes.length > 1 ? `sizes ${product.sizes.join(", ")}` : `size ${product.sizes[0]}`}
        </p>
        <div className="mt-2 flex items-center gap-2.5">
          <span className="price-tag">{formatPKR(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[13px] text-ink-faint line-through">{formatPKR(product.originalPrice)}</span>
          )}
        </div>
        {!soldOut && product.stock === 1 && <p className="mt-1.5 text-[12px] font-semibold text-tomato">One of one</p>}
      </div>
    </article>
  );
}

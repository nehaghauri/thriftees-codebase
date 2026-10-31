import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { CartLine } from '../types';
import { formatPKR } from '../utils/format';
import QuantityStepper from './QuantityStepper';

interface Props {
  line: CartLine;
  compact?: boolean;
}

export default function CartItem({ line, compact = false }: Props) {
  const { updateQuantity, removeItem, quantityInCart } = useCart();
  const { product, size, quantity, key } = line;
  // The most this line can reach: total stock minus what other sizes of the same product hold
  const max = product.stock - (quantityInCart(product.id) - quantity);

  return (
    <li className="flex gap-3.5 py-4 sm:gap-5">
      <Link to={`/product/${product.id}`} className={`shrink-0 overflow-hidden rounded-xl border-2 border-ink bg-white ${compact ? 'h-24 w-[4.75rem]' : 'h-32 w-[6.25rem] sm:h-40 sm:w-32'}`}>
        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/product/${product.id}`} className="block font-display text-base font-bold leading-snug hover:text-tomato sm:text-lg">
              {product.name}
            </Link>
            <p className="mt-0.5 text-[13px] text-ink-soft">
              Size {size}, {product.condition}
            </p>
          </div>
          {!compact && <p className="shrink-0 font-mono text-sm font-medium">{formatPKR(product.price * quantity)}</p>}
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
          {max <= 1 && quantity === 1 && product.stock === 1 ? (
            <span className="text-[13px] font-semibold text-tomato">One of one. Only 1 available.</span>
          ) : (
            <div className="flex items-center gap-2">
              <QuantityStepper value={quantity} max={max} onChange={(n) => updateQuantity(key, n)} small label={`Quantity for ${product.name}`} />
              {quantity >= max && <span className="text-[12px] font-semibold text-tomato">Max available</span>}
            </div>
          )}
          <div className="flex items-center gap-3">
            {compact && <span className="font-mono text-sm font-medium">{formatPKR(product.price * quantity)}</span>}
            <button type="button" onClick={() => removeItem(key)} className="flex items-center gap-1 text-[13px] font-semibold text-ink-soft transition hover:text-tomato" aria-label={`Remove ${product.name} from cart`}>
              <Trash2 size={15} aria-hidden />
              {!compact && 'Remove'}
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

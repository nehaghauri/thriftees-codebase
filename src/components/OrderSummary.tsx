import type { ReactNode } from 'react';
import type { SummaryItem } from '../types';
import { formatPKR } from '../utils/format';

interface Props {
  items?: SummaryItem[];
  subtotal: number;
  shipping: number;
  total: number;
  title?: string;
  children?: ReactNode;
}

export default function OrderSummary({ items, subtotal, shipping, total, title = 'Order summary', children }: Props) {
  return (
    <section aria-label={title} className="rounded-2xl border-2 border-ink bg-white p-5 shadow-pop sm:p-6">
      <h2 className="font-display text-2xl font-extrabold">{title}</h2>

      {items && items.length > 0 && (
        <ul className="mt-4 divide-y-2 divide-ink/10 border-y-2 border-ink/10">
          {items.map((i) => (
            <li key={i.id} className="flex items-center gap-3 py-3">
              <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg border-2 border-ink bg-paper-deep">
                <img src={i.image} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{i.name}</p>
                <p className="text-[12px] text-ink-soft">
                  Size {i.size}, qty {i.quantity}
                </p>
              </div>
              <p className="font-mono text-[13px] font-medium">{formatPKR(i.unitPrice * i.quantity)}</p>
            </li>
          ))}
        </ul>
      )}

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-soft">Subtotal</dt>
          <dd className="font-mono font-medium">{formatPKR(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-soft">Shipping</dt>
          <dd className="font-mono font-medium">{shipping === 0 ? 'Free' : formatPKR(shipping)}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t-2 border-ink pt-3">
          <dt className="font-display text-lg font-bold">Total</dt>
          <dd className="font-mono text-xl font-medium">{formatPKR(total)}</dd>
        </div>
      </dl>
      {children && <div className="mt-5">{children}</div>}
    </section>
  );
}

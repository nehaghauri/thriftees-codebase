import { Truck } from 'lucide-react';
import { SHIPPING } from '../data/site';
import { formatPKR } from '../utils/format';

export default function FreeShippingBar({ subtotal }: { subtotal: number }) {
  if (subtotal <= 0) return null;
  const left = SHIPPING.freeOver - subtotal;
  const pct = Math.min(100, (subtotal / SHIPPING.freeOver) * 100);
  return (
    <div className="rounded-xl border-2 border-ink bg-mint/60 p-3">
      <p className="flex items-center gap-2 text-[13px] font-semibold">
        <Truck size={16} aria-hidden />
        {left > 0 ? `Add ${formatPKR(left)} more for free delivery` : 'You have unlocked free delivery'}
      </p>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full border-2 border-ink bg-white" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to free delivery">
        <div className="h-full bg-tomato transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

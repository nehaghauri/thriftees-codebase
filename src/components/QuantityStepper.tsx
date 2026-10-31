import { Minus, Plus } from 'lucide-react';

interface Props {
  value: number;
  max: number;
  onChange: (next: number) => void;
  label?: string;
  small?: boolean;
}

export default function QuantityStepper({ value, max, onChange, label = 'Quantity', small = false }: Props) {
  const btn = `flex items-center justify-center transition hover:bg-butter disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent ${small ? 'h-8 w-8' : 'h-10 w-10'}`;
  return (
    <div className="inline-flex items-center rounded-full border-2 border-ink bg-white" role="group" aria-label={label}>
      <button type="button" className={`${btn} rounded-l-full`} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        <Minus size={small ? 14 : 16} />
      </button>
      <span className={`min-w-[2rem] text-center text-sm font-bold tabular-nums`} aria-live="polite">
        {value}
      </span>
      <button type="button" className={`${btn} rounded-r-full`} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity" title={value >= max ? `Only ${max} available` : undefined}>
        <Plus size={small ? 14 : 16} />
      </button>
    </div>
  );
}

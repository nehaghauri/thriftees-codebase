import type { Condition } from '../types';
import { conditionInfo } from '../data/conditions';

/** Condition label with a 4-dot meter (more filled = closer to new). */
export default function ConditionBadge({ condition, showNote = false }: { condition: Condition; showNote?: boolean }) {
  const info = conditionInfo(condition);
  return (
    <div>
      <div className="inline-flex items-center gap-2 text-[13px] font-semibold">
        <span className="flex gap-0.5" aria-hidden>
          {[1, 2, 3, 4].map((n) => (
            <span key={n} className={`h-2.5 w-2.5 rounded-full border border-ink ${n <= info.level ? 'bg-ink' : 'bg-transparent'}`} />
          ))}
        </span>
        {condition}
      </div>
      {showNote && <p className="mt-1 text-sm text-ink-soft">{info.note}</p>}
    </div>
  );
}

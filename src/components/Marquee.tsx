const Star = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden className="mx-6 shrink-0">
    <path d="M12 1 14.6 9.4 23 12 14.6 14.6 12 23 9.4 14.6 1 12 9.4 9.4Z" fill="currentColor" />
  </svg>
);

export default function Marquee({ items }: { items: string[] }) {
  const row = (suffix: string) =>
    items.map((t, i) => (
      <span key={`${suffix}${i}`} className="flex shrink-0 items-center">
        <span className="font-display text-xl font-bold sm:text-2xl">{t}</span>
        <Star />
      </span>
    ));
  return (
    <div className="marquee overflow-hidden border-y-2 border-ink bg-butter py-3" aria-label={items.join(', ')} role="group">
      <div className="marquee-track flex w-max" aria-hidden>
        {row('a')}
        {row('b')}
      </div>
    </div>
  );
}

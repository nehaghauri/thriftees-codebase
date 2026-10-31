import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  sub?: string;
  to?: string;
  linkLabel?: string;
  action?: ReactNode;
}

export default function SectionHeading({ title, sub, to, linkLabel = 'View all', action }: Props) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-3xl font-extrabold sm:text-4xl">{title}</h2>
        {sub && <p className="mt-1.5 max-w-xl text-ink-soft">{sub}</p>}
      </div>
      {action ??
        (to && (
          <Link to={to} className="group hidden shrink-0 items-center gap-1.5 font-semibold sm:flex">
            <span className="link-u">{linkLabel}</span>
            <ArrowRight size={16} className="transition group-hover:translate-x-1" aria-hidden />
          </Link>
        ))}
    </div>
  );
}

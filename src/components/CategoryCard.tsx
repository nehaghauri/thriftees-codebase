import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Category } from '../types';

interface Props {
  category: Category;
  count: number;
  image?: string;
}

export default function CategoryCard({ category, count, image }: Props) {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="group relative block overflow-hidden rounded-2xl border-2 border-ink bg-white transition duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop"
    >
      <div className="aspect-[5/4] overflow-hidden bg-paper-deep">
        {image && <img src={image} alt="" loading="lazy" className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105" />}
      </div>
      <div className="flex items-center justify-between gap-2 border-t-2 border-ink px-3.5 py-3">
        <div>
          <h3 className="font-display text-lg font-bold leading-none">{category.label}</h3>
          <p className="mt-1 text-[12px] text-ink-soft">{count} {count === 1 ? 'piece' : 'pieces'}</p>
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-butter transition group-hover:bg-tomato group-hover:text-white">
          <ArrowUpRight size={16} aria-hidden />
        </span>
      </div>
    </Link>
  );
}

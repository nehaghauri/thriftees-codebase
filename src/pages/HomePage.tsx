import { ArrowRight, BadgeCheck, ChevronLeft, ChevronRight, Heart, Shirt, Sparkles } from 'lucide-react';
import { useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import Marquee from '../components/Marquee';
import ProductCard from '../components/ProductCard';
import ProductGrid from '../components/ProductGrid';
import SectionHeading from '../components/SectionHeading';
import { categoriesFor } from '../data/categories';
import { COLLECTIONS } from '../data/collections';
import { SHIPPING } from '../data/site';
import { usePageTitle } from '../hooks/usePageTitle';
import type { Collection, Gender } from '../types';
import { formatPKR } from '../utils/format';
import { countInCategory, getCollectionProducts, getFeatured, getNewArrivals, getProductById, getProductsByCategory } from '../utils/products';

/* ------------------------------------------------------------------ */
/* Hero: a clothes rail. Hangers drop in on load, swing when touched,   */
/* and drift a little with the pointer.                                 */
/* ------------------------------------------------------------------ */
const HANGERS = [
  { id: 'thr-037', left: '2%', rot: 5, depth: 10, delay: 0.05 },
  { id: 'thr-007', left: '34%', rot: -4, depth: 18, delay: 0.2 },
  { id: 'thr-010', left: '66%', rot: 6, depth: 8, delay: 0.35 },
];

function Hero() {
  const stage = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = stage.current;
    if (!el || e.pointerType === 'touch') return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--px', String(((e.clientX - r.left) / r.width - 0.5) * 2));
    el.style.setProperty('--py', String(((e.clientY - r.top) / r.height - 0.5) * 2));
  };

  return (
    <section className="container-x grid items-center gap-10 pb-14 pt-10 lg:grid-cols-[1fr_1.05fr] lg:gap-6 lg:pb-20 lg:pt-14">
      <div>
        <h1 className="text-[clamp(3rem,7.4vw,6.4rem)] font-extrabold leading-[0.92]">
          Already loved.
          <br />
          Ready for you.
        </h1>
        <p className="mt-6 max-w-md text-lg text-ink-soft">
          Hand-picked pre-loved clothes for men and women. Washed, checked and honestly graded, and most pieces exist exactly once.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/women" className="btn btn-primary btn-lg">
            Shop women
          </Link>
          <Link to="/men" className="btn btn-light btn-lg">
            Shop men
          </Link>
        </div>
        <p className="mt-6 text-sm font-medium text-ink-soft">Cash on delivery. Free delivery over {formatPKR(SHIPPING.freeOver)}.</p>
      </div>

      <div ref={stage} onPointerMove={onMove} className="relative h-[430px] sm:h-[540px] lg:h-[580px]" style={{ '--px': 0, '--py': 0 } as CSSProperties}>
        {/* the rail */}
        <div className="absolute inset-x-0 top-5 h-2.5 rounded-full border-2 border-ink bg-butter" aria-hidden />
        <div className="absolute -left-1 top-3 h-6 w-3 rounded-full border-2 border-ink bg-ink" aria-hidden />
        <div className="absolute -right-1 top-3 h-6 w-3 rounded-full border-2 border-ink bg-ink" aria-hidden />

        {HANGERS.map((h) => {
          const p = getProductById(h.id);
          if (!p) return null;
          return (
            <div key={h.id} className="absolute top-6 w-[31%] animate-drop" style={{ left: h.left, animationDelay: `${h.delay}s` }}>
              <div style={{ transform: `translate(calc(var(--px) * ${h.depth}px), calc(var(--py) * ${h.depth * 0.6}px))`, transition: 'transform 0.25s ease-out' }}>
                <Link to={`/product/${p.id}`} className="hanger block" style={{ '--r': `${h.rot}deg` } as CSSProperties} aria-label={`${p.name}, ${formatPKR(p.price)}`}>
                  <svg viewBox="0 0 60 34" className="mx-auto -mb-0.5 h-8 w-14" fill="none" stroke="#151B3B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M30 2c-4 0-6 3-4.500 6 .9 1.800 4.500 2.500 4.500 6" />
                    <path d="M30 14 4 30h52Z" />
                  </svg>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl border-2 border-ink bg-white shadow-pop transition hover:shadow-pop-lg">
                    <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                    <span className="price-tag absolute bottom-2.5 left-2.5 !text-[11px] sm:!text-[13px]">{formatPKR(p.price)}</span>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}

        {/* spinning sticker */}
        <div className="absolute -bottom-2 right-0 h-28 w-28 sm:h-36 sm:w-36">
          <svg viewBox="0 0 120 120" className="h-full w-full animate-spinslow" aria-hidden>
            <circle cx="60" cy="60" r="58" fill="#F7D94C" stroke="#151B3B" strokeWidth="2.5" />
            <defs>
              <path id="ring" d="M60 60 m-40 0 a40 40 0 1 1 80 0 a40 40 0 1 1 -80 0" />
            </defs>
            <text fontSize="12.5" fontWeight="700" fill="#151B3B" fontFamily="Bricolage Grotesque, sans-serif" letterSpacing="2.2">
              <textPath href="#ring">one of one * one of one * one of one *</textPath>
            </text>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-display text-2xl font-extrabold sm:text-3xl">1/1</span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function CategorySection() {
  const [gender, setGender] = useState<Gender>('women');
  const cats = categoriesFor(gender);
  const shown = cats.slice(0, 7);
  return (
    <section className="container-x py-14 sm:py-20">
      <SectionHeading
        title="Shop by category"
        sub="Pick a lane and start digging."
        action={
          <div role="tablist" aria-label="Choose collection" className="inline-flex rounded-full border-2 border-ink bg-white p-1">
            {(['women', 'men'] as Gender[]).map((g) => (
              <button
                key={g}
                role="tab"
                type="button"
                aria-selected={gender === g}
                onClick={() => setGender(g)}
                className={`rounded-full px-5 py-1.5 text-sm font-bold transition ${gender === g ? 'bg-ink text-paper' : 'hover:bg-butter'}`}
              >
                {g === 'women' ? 'Women' : 'Men'}
              </button>
            ))}
          </div>
        }
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {shown.map((c) => (
          <CategoryCard key={c.slug} category={c} count={countInCategory(c.slug)} image={getProductsByCategory(c.slug)[0]?.images[0]} />
        ))}
        <Link to={`/${gender}`} className="group flex flex-col justify-between rounded-2xl border-2 border-ink bg-butter p-4 transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop">
          <span className="font-display text-2xl font-extrabold leading-tight">See all {cats.length} categories</span>
          <span className="mt-6 flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-white transition group-hover:translate-x-1">
            <ArrowRight size={18} aria-hidden />
          </span>
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
const TONE: Record<Collection['tone'], string> = { butter: 'bg-butter', mint: 'bg-mint', pink: 'bg-pink', sky: 'bg-sky' };

function CollectionTile({ c }: { c: Collection }) {
  const items = getCollectionProducts(c.id);
  const pics = items.filter((p) => p.stock > 0).slice(0, 3);
  const pos = [
    'left-0 -rotate-6 group-hover:-translate-x-2 group-hover:-rotate-[10deg]',
    'left-[26%] z-10 rotate-2 group-hover:-translate-y-3',
    'left-[52%] rotate-6 group-hover:translate-x-2 group-hover:rotate-[10deg]',
  ];
  return (
    <Link to={`/shop?collection=${c.id}`} className={`group relative flex h-[400px] flex-col overflow-hidden rounded-3xl border-2 border-ink p-5 transition duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-lg ${TONE[c.tone]}`}>
      <h3 className="font-display text-3xl font-extrabold leading-none">{c.title}</h3>
      <p className="mt-2 max-w-[16rem] text-sm font-medium text-ink/80">{c.blurb}</p>
      <p className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full border-2 border-ink bg-white px-3 py-1 text-[13px] font-bold">
        {items.length} pieces <ArrowRight size={14} aria-hidden />
      </p>
      <div className="relative mt-auto h-48">
        {pics.map((p, i) => (
          <img key={p.id} src={p.images[0]} alt="" loading="lazy" className={`absolute bottom-[-30px] w-[48%] rounded-xl border-2 border-ink object-cover shadow-pop transition duration-300 ${pos[i]}`} style={{ aspectRatio: '4 / 5' }} />
        ))}
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
function NewArrivals() {
  const rail = useRef<HTMLDivElement>(null);
  const items = getNewArrivals(8);
  const scroll = (dir: 1 | -1) => rail.current?.scrollBy({ left: dir * rail.current.clientWidth * 0.8, behavior: 'smooth' });
  const arrow = 'flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-white transition hover:bg-butter hover:shadow-pop';
  return (
    <section className="py-14 sm:py-20">
      <div className="container-x">
        <SectionHeading
          title="New arrivals"
          sub="The latest pieces to land. Fresh ones go fast."
          action={
            <div className="flex gap-2">
              <button type="button" onClick={() => scroll(-1)} className={arrow} aria-label="Scroll new arrivals left">
                <ChevronLeft size={20} />
              </button>
              <button type="button" onClick={() => scroll(1)} className={arrow} aria-label="Scroll new arrivals right">
                <ChevronRight size={20} />
              </button>
            </div>
          }
        />
      </div>
      <div ref={rail} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:gap-5 sm:px-6 lg:px-[max(2.5rem,calc((100vw-1320px)/2+2.5rem))]" tabIndex={0} aria-label="New arrivals">
        {items.map((p) => (
          <div key={p.id} className="w-[62%] shrink-0 snap-start sm:w-[36%] md:w-[28%] lg:w-[22.5%]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      <div className="container-x mt-4">
        <Link to="/shop?sort=newest" className="btn btn-light">
          See everything new
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
const WHY = [
  { icon: Shirt, tone: 'bg-butter', title: 'Hand-picked', text: 'Every piece is chosen one by one, never bought in bulk and dumped online.' },
  { icon: Sparkles, tone: 'bg-mint', title: 'Washed and checked', text: 'Cleaned and inspected before it goes live, so it arrives ready to wear.' },
  { icon: BadgeCheck, tone: 'bg-pink', title: 'Honest grades', text: 'Four clear condition grades, with flaws called out in the description.' },
  { icon: Heart, tone: 'bg-sky', title: 'One of one', text: 'Most items exist once, so your outfit will not be anyone else’s.' },
];

function WhySection() {
  return (
    <section className="border-y-2 border-ink bg-paper-deep py-14 sm:py-20">
      <div className="container-x">
        <SectionHeading title="Why shop at Thriftees" sub="Secondhand should feel like a find, not a gamble." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w, i) => (
            <div key={w.title} className={`rounded-3xl border-2 border-ink p-6 transition duration-200 hover:-translate-y-1 hover:shadow-pop ${w.tone} ${i % 2 ? 'hover:rotate-1' : 'hover:-rotate-1'}`}>
              <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink bg-white">
                <w.icon size={22} aria-hidden />
              </span>
              <h3 className="mt-5 font-display text-2xl font-extrabold leading-tight">{w.title}</h3>
              <p className="mt-2 text-[15px] text-ink/80">{w.text}</p>
            </div>
          ))}
        </div>
        <Link to="/info/condition-guide" className="mt-8 inline-flex items-center gap-1.5 font-semibold">
          <span className="link-u">Read the condition guide</span>
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
export default function HomePage() {
  usePageTitle();
  const trending = getFeatured(8);
  return (
    <>
      <Hero />
      <Marquee items={['One of a kind', 'Washed and checked', 'Honestly graded', 'Cash on delivery', `Free delivery over ${formatPKR(SHIPPING.freeOver)}`]} />
      <CategorySection />

      <section className="container-x pb-6 sm:pb-10">
        <SectionHeading title="Featured collections" sub="Little edits to get you started." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {COLLECTIONS.map((c) => (
            <CollectionTile key={c.id} c={c} />
          ))}
        </div>
      </section>

      <NewArrivals />

      <section className="container-x pb-14 sm:pb-20">
        <SectionHeading title="Trending now" sub="What everyone keeps opening." to="/shop" linkLabel="Shop everything" />
        <ProductGrid products={trending} />
      </section>

      <WhySection />
    </>
  );
}

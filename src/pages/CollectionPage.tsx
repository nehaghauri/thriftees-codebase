import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import CategoryCard from '../components/CategoryCard';
import ProductGrid from '../components/ProductGrid';
import SectionHeading from '../components/SectionHeading';
import { categoriesFor, GENDER_LABEL } from '../data/categories';
import { usePageTitle } from '../hooks/usePageTitle';
import type { Gender } from '../types';
import { countInCategory, getNewArrivals, getProductsByCategory, getProductsByGender } from '../utils/products';

const COPY: Record<Gender, { blurb: string; tone: string }> = {
  women: { blurb: 'Dresses, denim, knits and shawls with a past life.', tone: 'bg-pink' },
  men: { blurb: 'Tees, jackets, denim and layers that already know how to fit.', tone: 'bg-sky' },
};

export default function CollectionPage({ gender }: { gender: Gender }) {
  const label = GENDER_LABEL[gender];
  usePageTitle(`${label}’s collection`);
  const cats = categoriesFor(gender);
  const total = getProductsByGender(gender).length;

  return (
    <>
      <section className={`border-b-2 border-ink ${COPY[gender].tone}`}>
        <div className="container-x py-8 sm:py-12">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label }]} />
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="text-[clamp(3.5rem,11vw,9rem)] font-extrabold leading-[0.85]">{label}</h1>
              <p className="mt-4 max-w-md text-lg font-medium text-ink/80">{COPY[gender].blurb}</p>
            </div>
            <Link to={`/shop?gender=${gender}`} className="btn btn-dark btn-lg">
              Shop all {total} pieces
            </Link>
          </div>
        </div>
      </section>

      <section className="container-x py-12 sm:py-16">
        <SectionHeading title="Pick a category" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {cats.map((c) => (
            <CategoryCard key={c.slug} category={c} count={countInCategory(c.slug)} image={getProductsByCategory(c.slug)[0]?.images[0]} />
          ))}
        </div>
      </section>

      <section className="container-x pb-4">
        <SectionHeading title={`New in for ${label.toLowerCase()}`} to={`/shop?gender=${gender}&sort=newest`} linkLabel="See all" />
        <ProductGrid products={getNewArrivals(4, gender)} />
        <Link to={`/shop?gender=${gender}&sort=newest`} className="mt-8 inline-flex items-center gap-1.5 font-semibold sm:hidden">
          <span className="link-u">See all new in {label.toLowerCase()}</span>
          <ArrowRight size={16} aria-hidden />
        </Link>
      </section>
    </>
  );
}

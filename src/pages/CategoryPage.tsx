import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductBrowser from '../components/ProductBrowser';
import { categoriesFor, GENDER_LABEL, getCategory } from '../data/categories';
import { usePageTitle } from '../hooks/usePageTitle';
import { countInCategory, getProductsByCategory } from '../utils/products';
import NotFoundPage from './NotFoundPage';

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const category = getCategory(categorySlug);
  usePageTitle(category ? `${GENDER_LABEL[category.gender]}’s ${category.label}` : undefined);
  if (!category) return <NotFoundPage />;

  const genderLabel = GENDER_LABEL[category.gender];
  const products = getProductsByCategory(category.slug);

  return (
    <div className="container-x py-8 sm:py-10">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: genderLabel, to: `/${category.gender}` }, { label: category.label }]} />

      <header className="mb-6 mt-5">
        <h1 className="text-5xl font-extrabold sm:text-6xl">
          {genderLabel}’s {category.label}
        </h1>
        <p className="mt-2 text-ink-soft">
          {countInCategory(category.slug)} {countInCategory(category.slug) === 1 ? 'piece' : 'pieces'} in this category
        </p>
        <nav aria-label={`${genderLabel} categories`} className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {categoriesFor(category.gender).map((c) => (
            <Link key={c.slug} to={`/category/${c.slug}`} aria-current={c.slug === category.slug ? 'page' : undefined} className={`chip shrink-0 ${c.slug === category.slug ? '!bg-ink !text-paper' : ''}`}>
              {c.label}
            </Link>
          ))}
        </nav>
      </header>

      <ProductBrowser
        key={category.slug}
        products={products}
        empty={
          <div className="rounded-2xl border-2 border-dashed border-ink/40 px-6 py-16 text-center">
            <p className="font-display text-2xl font-bold">Nothing here yet</p>
            <p className="mt-1.5 text-ink-soft">New pieces land often. Check back soon.</p>
          </div>
        }
      />
    </div>
  );
}

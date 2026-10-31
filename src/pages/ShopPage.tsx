import { Link, useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductBrowser from '../components/ProductBrowser';
import { GENDER_LABEL } from '../data/categories';
import { getCollection } from '../data/collections';
import { PRODUCTS } from '../data/products';
import { usePageTitle } from '../hooks/usePageTitle';
import type { Gender } from '../types';
import { getCollectionProducts, isSortKey, searchProducts } from '../utils/products';

function ShopResults() {
  const [params] = useSearchParams();
  const q = (params.get('q') ?? '').trim();
  const genderParam = params.get('gender');
  const gender: Gender | null = genderParam === 'men' || genderParam === 'women' ? genderParam : null;
  const collection = getCollection(params.get('collection'));
  const sortParam = params.get('sort');
  const sort = isSortKey(sortParam) ? sortParam : 'featured';

  let pool = collection ? getCollectionProducts(collection.id) : PRODUCTS;
  if (gender) pool = pool.filter((p) => p.gender === gender);
  if (q) pool = searchProducts(q, pool);

  let title = 'Shop everything';
  if (q) title = `Results for “${q}”`;
  else if (collection) title = collection.title;
  else if (sortParam === 'newest' && !gender) title = 'New in';
  else if (gender) title = `${GENDER_LABEL[gender]}, all pieces`;
  usePageTitle(title);

  const crumbs = [{ label: 'Home', to: '/' }, ...(gender ? [{ label: GENDER_LABEL[gender], to: `/${gender}` }] : []), { label: q ? 'Search' : collection ? 'Collection' : 'Shop' }];

  return (
    <div className="container-x py-8 sm:py-10">
      <Breadcrumbs items={crumbs} />
      <header className="mb-8 mt-5">
        <h1 className="text-5xl font-extrabold sm:text-6xl">{title}</h1>
        {collection && <p className="mt-2 max-w-xl text-ink-soft">{collection.blurb}</p>}
      </header>

      <ProductBrowser
        products={pool}
        initialSort={sort}
        empty={
          <div className="rounded-2xl border-2 border-dashed border-ink/40 bg-white/60 px-6 py-16 text-center">
            <p className="font-display text-2xl font-bold">We could not find anything{q ? ` for “${q}”` : ''}</p>
            <p className="mx-auto mt-1.5 max-w-sm text-ink-soft">Check the spelling, or try something broader like “jeans” or “dress”.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/women" className="btn btn-primary">Browse women</Link>
              <Link to="/men" className="btn btn-light">Browse men</Link>
            </div>
          </div>
        }
      />
    </div>
  );
}

export default function ShopPage() {
  const [params] = useSearchParams();
  // Re-mount when the URL query changes so sort/filters reset cleanly
  return <ShopResults key={params.toString()} />;
}

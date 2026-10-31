import { Check, Minus } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ConditionBadge from '../components/ConditionBadge';
import ProductGrid from '../components/ProductGrid';
import QuantityStepper from '../components/QuantityStepper';
import SectionHeading from '../components/SectionHeading';
import { GENDER_LABEL, getCategory } from '../data/categories';
import { useCart } from '../context/CartContext';
import { usePageTitle } from '../hooks/usePageTitle';
import type { Product } from '../types';
import { discountPercent, formatPKR } from '../utils/format';
import { getProductById, getRelated } from '../utils/products';
import NotFoundPage from './NotFoundPage';

function availability(p: Product, left: number) {
  if (p.stock <= 0) return { text: 'Sold out', dot: 'bg-ink' };
  if (left <= 0) return { text: 'All available pieces are in your cart', dot: 'bg-butter' };
  if (p.stock === 1) return { text: 'In stock: one of one, only 1 piece', dot: 'bg-tomato' };
  if (p.stock <= 3) return { text: `In stock: only ${p.stock} left`, dot: 'bg-tomato' };
  return { text: `In stock: ${p.stock} available`, dot: 'bg-mint' };
}

function ProductDetail({ product }: { product: Product }) {
  const { addItem, quantityInCart, openDrawer } = useCart();
  const category = getCategory(product.categorySlug);
  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(0);
  usePageTitle(product.name);

  const inCart = quantityInCart(product.id);
  const left = product.stock - inCart;
  const soldOut = product.stock <= 0;
  const qtyShown = Math.max(1, Math.min(qty, left));
  const off = discountPercent(product.price, product.originalPrice);
  const avail = availability(product, left);
  const related = getRelated(product, 4);

  const handleAdd = () => {
    if (!size) {
      setError('Please choose a size first.');
      setShake((s) => s + 1);
      return;
    }
    const res = addItem(product, size, qtyShown);
    if (res.ok) {
      setError(null);
      setQty(1);
    } else {
      setError(res.reason);
    }
  };

  return (
    <div className="container-x py-8 sm:py-10">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: GENDER_LABEL[product.gender], to: `/${product.gender}` },
          ...(category ? [{ label: category.label, to: `/category/${category.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        {/* Gallery */}
        <div className="grid gap-3 sm:grid-cols-[84px_1fr]">
          <div className="order-2 flex gap-3 sm:order-1 sm:flex-col">
            {product.images.map((src, i) => (
              <button key={src} type="button" onClick={() => setImgIdx(i)} aria-label={`Show image ${i + 1}`} aria-current={i === imgIdx} className={`aspect-[4/5] w-20 overflow-hidden rounded-xl border-2 bg-white transition sm:w-full ${i === imgIdx ? 'border-ink shadow-pop' : 'border-ink/30 hover:border-ink'}`}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="relative order-1 aspect-[4/5] overflow-hidden rounded-3xl border-2 border-ink bg-white shadow-pop-lg sm:order-2">
            <img src={product.images[imgIdx]} alt={product.name} className={`h-full w-full object-cover ${soldOut ? 'grayscale' : ''}`} />
            <div className="absolute left-4 top-4 flex flex-col items-start gap-1.5">
              {soldOut && <span className="sticker bg-ink text-paper">Sold out</span>}
              {off > 0 && !soldOut && <span className="sticker bg-tomato text-white">-{off}%</span>}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="lg:pt-2">
          <p className="text-sm font-semibold text-ink-soft">
            {GENDER_LABEL[product.gender]}, {category?.label}
          </p>
          <h1 className="mt-1 text-4xl font-extrabold leading-[1.05] sm:text-5xl">{product.name}</h1>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="font-mono text-3xl font-medium">{formatPKR(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-lg text-ink-faint line-through">{formatPKR(product.originalPrice)}</span>
                <span className="sticker bg-butter">Save {off}%</span>
              </>
            )}
          </div>
          <p className="mt-1 text-[13px] text-ink-soft">Original retail price shown for reference. Shipping is calculated in your cart.</p>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
            <ConditionBadge condition={product.condition} />
            <p className="flex items-center gap-2 text-[13px] font-semibold">
              <span className={`h-3 w-3 rounded-full border-2 border-ink ${avail.dot}`} aria-hidden />
              {avail.text}
            </p>
          </div>

          <p className="mt-6 text-[17px] leading-relaxed text-ink/90">{product.description}</p>

          {/* Size */}
          {!soldOut && (
            <div className="mt-7">
              <div className={`flex items-baseline justify-between ${error && !size ? 'animate-shake' : ''}`} key={shake}>
                <h2 id="size-label" className="font-display text-lg font-bold">
                  Size {size && <span className="font-sans text-base font-medium text-ink-soft">{size}</span>}
                </h2>
                <Link to="/info/condition-guide" className="text-[13px] font-semibold link-u">
                  Condition guide
                </Link>
              </div>
              <div role="radiogroup" aria-labelledby="size-label" className="mt-2.5 flex flex-wrap gap-2.5">
                {product.sizes.map((s) => (
                  <button key={s} type="button" role="radio" aria-checked={size === s} className="chip !px-5 !py-2.5" onClick={() => { setSize(s); setError(null); }}>
                    {s}
                  </button>
                ))}
              </div>

              {product.stock > 1 && left > 0 && (
                <div className="mt-5 flex items-center gap-3">
                  <span className="text-sm font-semibold">Quantity</span>
                  <QuantityStepper value={qtyShown} max={left} onChange={setQty} />
                </div>
              )}
            </div>
          )}

          {error && (
            <p className="error-text mt-3" role="alert">
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={handleAdd} disabled={soldOut || left <= 0} className="btn btn-primary btn-lg flex-1 sm:flex-none sm:min-w-[260px]">
              {soldOut ? 'Sold out' : left <= 0 ? (
                <>
                  <Check size={18} aria-hidden /> In your cart
                </>
              ) : (
                'Add to cart'
              )}
            </button>
            {inCart > 0 && (
              <button type="button" onClick={openDrawer} className="btn btn-light btn-lg">
                View cart ({inCart})
              </button>
            )}
          </div>
          {product.stock === 1 && !soldOut && (
            <p className="mt-3 flex items-center gap-1.5 text-[13px] text-ink-soft">
              <Minus size={14} aria-hidden /> This is a one-of-a-kind piece, so you can add just 1.
            </p>
          )}

          <div className="mt-8 divide-y-2 divide-ink/15 border-y-2 border-ink/15">
            <details className="group py-4" open>
              <summary className="cursor-pointer list-none font-display text-lg font-bold">Condition</summary>
              <div className="mt-3">
                <ConditionBadge condition={product.condition} showNote />
              </div>
            </details>
            <details className="group py-4">
              <summary className="cursor-pointer list-none font-display text-lg font-bold">Delivery and returns</summary>
              <p className="mt-3 text-[15px] text-ink-soft">
                Cash on delivery. Read our <Link to="/info/shipping" className="link-u font-semibold text-ink">shipping</Link> and <Link to="/info/returns" className="link-u font-semibold text-ink">returns</Link> pages for the details.
              </p>
            </details>
            <details className="group py-4">
              <summary className="cursor-pointer list-none font-display text-lg font-bold">Product details</summary>
              <p className="mt-3 font-mono text-[13px] text-ink-soft">Item no. {product.id.replace('thr-', '')}</p>
            </details>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <SectionHeading title="You might also like" sub="More from the same corner of the rack." />
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}

export default function ProductPage() {
  const { productId } = useParams();
  const product = getProductById(productId);
  if (!product) return <NotFoundPage />;
  // key resets size / quantity / gallery state when you navigate between products
  return <ProductDetail key={product.id} product={product} />;
}

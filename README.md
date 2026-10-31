# Thriftees

A frontend-only thrift clothing store for men and women. React + TypeScript + Vite + Tailwind CSS + React Router + Lucide.
Prices are in PKR, checkout is Cash on Delivery, and the cart and orders live in LocalStorage.

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

Other commands:

```bash
npm run build      # type-check + production build into /dist
npm run preview    # serve the production build locally
npm run typecheck  # TypeScript only
```

Needs Node 18 or newer.

## Try the cart and COD checkout

1. On the home page, hover any product card (on a desktop) and tap a size to quick-add, or open a product and press **Add to cart**.
2. The cart drawer slides in. The cart icon in the header shows the live count.
3. Try **Navy Oxford Button-Down** (`/product/thr-003`). It is a one-of-one piece: after adding it, you cannot add a second.
4. Try **Red Stripe Ringer Tee** (`/product/thr-002`, 3 in stock). Pick a size and raise the quantity: it stops at 3.
5. Refresh the page. Your cart is still there.
6. Open `/cart`: change quantities, remove items, watch the shipping line. Orders under PKR 6,000 pay PKR 250 shipping, and anything over ships free.
7. Press **Proceed to checkout**. Submit the empty form to see validation. Then fill it in (phone like `0300 1234567`, postal code 5 digits) and press **Place order**.
8. You land on `/order-confirmation/<ORDER-ID>` with your order summary. The cart is now empty.
9. DevTools > Application > Local Storage shows `thriftees.orders.v1` (the saved orders) and `thriftees.cart.v1` (the cart).

Two products (`thr-009` and `thr-031`) are sold out, so you can see how those states look.

## Demo-only (not real)

- **Orders are not sent anywhere.** They are saved in the browser's LocalStorage, so they only exist on that browser.
- **No payments.** Cash on Delivery is the only method and nothing is charged.
- **No emails or SMS** are sent. The confirmation page mentions your email address but nothing is delivered.
- **Stock is not reduced after an order.** Stock numbers come from `src/data/products.ts`. Placing a demo order does not change them, so a one-of-one piece reappears after you order it. Real stock needs a backend.
- **Product images are placeholder illustrations**, not photographs (see below).
- **Shipping, returns and About pages contain sample copy.** Edit `src/data/info.ts` before launch.
- **Contact details and social links are placeholders.** Edit `src/data/site.ts`. Social icons only become links once you add a URL.

## Add your real inventory

Everything lives in `src/data/products.ts`. Copy an entry and edit it:

```ts
{
  id: 'thr-043',                 // unique, used in the URL
  name: 'Your product name',
  categorySlug: 'women-dresses', // must match a slug in src/data/categories.ts
  gender: 'women',
  price: 2500,                   // PKR
  originalPrice: 6000,           // optional, drives the discount badge
  sizes: ['M'],
  stock: 1,                      // 1 = one of one, 0 = sold out
  condition: 'Excellent',        // Like New | Excellent | Good | Gently Used
  description: '...',
  images: ['/products/my-photo-1.jpg', '/products/my-photo-2.jpg'],
  dateAdded: '2026-11-01',       // newest 8 appear under "New arrivals"
  featured: true,                // featured pieces show under "Trending now"
}
```

**Photos:** put your files in `public/products/` and point `images` at them (`'/products/my-photo-1.jpg'`). The first image is the main photo and the second appears on hover. Use portrait 4:5 photos for the best fit.
The current `/products/thr-0XX-a.svg` files are generated placeholders. Once you have your own photos you can delete them along with `scripts/generate-placeholder-art.mjs`.

**Categories** are in `src/data/categories.ts`. Each category slug is `gender-label`, e.g. `men-t-shirts`.
**Home page collections** are in `src/data/collections.ts` (lists of product ids).
**Shipping fee and free-shipping threshold** are in `src/data/site.ts`.

## Routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/men`, `/women` | Collection pages with category cards |
| `/category/:categorySlug` | Category page with filters (size, price, availability) and sorting |
| `/product/:productId` | Product details |
| `/cart` | Cart |
| `/checkout` | Checkout (COD demo) |
| `/order-confirmation/:orderId` | Order confirmation |
| `/shop`, `/search?q=...` | All products, search results, collections (`?collection=denim-days`), new in (`?sort=newest`) |
| `/info/:slug` | About, shipping, returns, condition guide, care guide, contact |

The last two rows are extras added so that the search bar and every footer link lead somewhere real.

## Folder structure

```
thriftees/
  index.html
  package.json
  vite.config.ts  tsconfig.json  tailwind.config.js  postcss.config.js
  public/
    favicon.svg
    products/               placeholder product illustrations (replace with photos)
  scripts/
    generate-placeholder-art.mjs   builds the placeholder SVGs (optional, `npm run art`)
  src/
    main.tsx  App.tsx  index.css
    types/index.ts          Product, Category, CartLine, Order, ...
    data/
      products.ts           YOUR INVENTORY
      categories.ts  collections.ts  conditions.ts  info.ts  site.ts
    context/CartContext.tsx cart state, stock rules, LocalStorage persistence
    hooks/                  useClickOutside, useBodyScrollLock, usePageTitle
    utils/                  format, storage, products (search/filter/sort), orders, validation
    layouts/MainLayout.tsx  navbar + footer + cart drawer around every page
    components/             Navbar, Footer, SearchBar, ProductCard, ProductGrid, CategoryCard,
                            Breadcrumbs, CartItem, CartDrawer, OrderSummary, CheckoutForm,
                            FilterPanel, ProductBrowser, Marquee, ...
    pages/                  Home, Collection, Category, Shop, Product, Cart, Checkout,
                            OrderConfirmation, Info, NotFound
```

## How it works

- **Cart:** a React Context (`CartContext`) holds `{ productId, size, quantity }` items and saves them to LocalStorage. Stock rules are enforced in one place: the total quantity of a product across all sizes can never exceed its `stock`. On load, the saved cart is validated against the product data, so an edited or outdated cart can't break the site.
- **Orders:** `utils/orders.ts` generates a unique ID (`THR-YYMMDD-XXXX`, checked against saved orders) and stores orders in LocalStorage.
- **Validation:** `utils/validation.ts` (Pakistani mobile numbers, 5-digit postal codes, email format, required fields).
- **Data is separate from UI:** pages and components only read from `src/data` and `src/utils/products.ts`.
- **No extra libraries** were added beyond your stack.

## Design system

- **Palette:** washed-denim paper `#ECEFF6`, indigo ink `#151B3B`, price-sticker tomato `#D63A28`, with butter, mint, pink and sky as tile colours. All defined in `tailwind.config.js`.
- **Type:** Bricolage Grotesque for headlines, Instrument Sans for text, DM Mono for prices and order IDs (Google Fonts, loaded in `index.html`).
- **Motion is kept for moments that matter:** the clothes-rail hangers swing when touched, product cards swap to a second image and reveal quick-add on hover, the cart count pops, and a slow marquee that pauses on hover. Everything respects `prefers-reduced-motion`.

## Verification

- `tsc --noEmit` and `vite build` both pass with no errors.
- An automated smoke test (not included in the zip, to keep the dependencies light) rendered every route, all 42 product pages, all 22 category pages and all info pages, and exercised: one-of-one limits, stock caps, sold-out blocking, tampered-cart cleanup, cart totals and free shipping, checkout validation, COD order placement and storage, cart clearing, sorting, in-stock filtering and the search bar. All 15 checks passed.
- It has **not** been viewed in a real browser by the author of this code, so please give the visuals a once-over on desktop and phone and tell me what you want adjusted.

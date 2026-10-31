import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

export default function NotFoundPage() {
  usePageTitle('Page not found');
  return (
    <div className="container-x py-20 text-center">
      <p className="font-display text-[clamp(6rem,22vw,14rem)] font-extrabold leading-none text-butter [-webkit-text-stroke:3px_#151B3B]">404</p>
      <h1 className="mt-2 text-4xl font-extrabold">This page got donated</h1>
      <p className="mx-auto mt-3 max-w-md text-ink-soft">We could not find what you were looking for. It may have sold out or moved.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn btn-primary">Back home</Link>
        <Link to="/shop" className="btn btn-light">Browse everything</Link>
      </div>
    </div>
  );
}

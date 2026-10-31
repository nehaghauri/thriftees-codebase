import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { getInfoPage, INFO_PAGES } from '../data/info';
import { usePageTitle } from '../hooks/usePageTitle';
import NotFoundPage from './NotFoundPage';

export default function InfoPage() {
  const { slug } = useParams();
  const page = getInfoPage(slug);
  usePageTitle(page?.title);
  if (!page) return <NotFoundPage />;

  return (
    <div className="container-x py-8 sm:py-12">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: page.title }]} />
      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_260px]">
        <article className="max-w-2xl">
          <h1 className="text-5xl font-extrabold sm:text-6xl">{page.title}</h1>
          <p className="mt-4 text-xl text-ink-soft">{page.intro}</p>
          {page.placeholder && (
            <p className="mt-6 rounded-xl border-2 border-dashed border-ink bg-butter/60 px-4 py-3 text-sm font-medium">
              Sample copy for you to edit. Update this page in src/data/info.ts before you launch.
            </p>
          )}
          <div className="mt-8 space-y-7">
            {page.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="font-display text-2xl font-extrabold">{s.heading}</h2>
                <p className="mt-1.5 text-[17px] leading-relaxed">{s.body}</p>
              </section>
            ))}
          </div>
        </article>
        <aside>
          <h2 className="mb-3 font-display text-lg font-bold">More info</h2>
          <ul className="space-y-1">
            {INFO_PAGES.map((p) => (
              <li key={p.slug}>
                <Link to={`/info/${p.slug}`} aria-current={p.slug === page.slug ? 'page' : undefined} className={`block rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-butter ${p.slug === page.slug ? 'bg-butter' : ''}`}>
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

import { Facebook, Instagram, MessageCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SITE } from '../data/site';

function Social({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  const cls = 'flex h-10 w-10 items-center justify-center rounded-full border-2 border-paper/60 transition';
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} className={`${cls} hover:border-butter hover:bg-butter hover:text-ink`}>
      {children}
    </a>
  ) : (
    // Placeholder: add the real URL in src/data/site.ts and it becomes a link.
    <span aria-label={`${label} (link not set yet)`} title="Add your link in src/data/site.ts" className={`${cls} opacity-50`}>
      {children}
    </span>
  );
}

const col = 'space-y-2.5 text-[15px]';
const lnk = 'text-paper/80 transition hover:text-butter';

export default function Footer() {
  return (
    <footer className="mt-24 overflow-hidden bg-ink text-paper">
      <div className="container-x grid gap-10 pb-10 pt-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <p className="font-display text-3xl font-extrabold lowercase">thriftees</p>
          <p className="mt-3 max-w-xs text-paper/80">Hand-picked pre-loved clothing for men and women. Every piece is washed, checked and honestly graded.</p>
          <div className="mt-5 flex gap-2.5">
            <Social href={SITE.social.instagram} label="Instagram">
              <Instagram size={18} />
            </Social>
            <Social href={SITE.social.facebook} label="Facebook">
              <Facebook size={18} />
            </Social>
            <Social href={SITE.social.whatsapp} label="WhatsApp">
              <MessageCircle size={18} />
            </Social>
          </div>
        </div>

        <nav aria-label="Shop">
          <h2 className="mb-3 font-display text-lg font-bold text-butter">Shop</h2>
          <ul className={col}>
            <li><Link className={lnk} to="/women">Women</Link></li>
            <li><Link className={lnk} to="/men">Men</Link></li>
            <li><Link className={lnk} to="/shop?sort=newest">New in</Link></li>
            <li><Link className={lnk} to="/shop">Shop everything</Link></li>
          </ul>
        </nav>

        <nav aria-label="Help">
          <h2 className="mb-3 font-display text-lg font-bold text-butter">Help</h2>
          <ul className={col}>
            <li><Link className={lnk} to="/info/shipping">Shipping</Link></li>
            <li><Link className={lnk} to="/info/returns">Returns</Link></li>
            <li><Link className={lnk} to="/info/condition-guide">Condition guide</Link></li>
            <li><Link className={lnk} to="/info/care">Care guide</Link></li>
            <li><Link className={lnk} to="/info/about">About us</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="mb-3 font-display text-lg font-bold text-butter">Say hello</h2>
          <ul className={col}>
            <li className="text-paper/80">{SITE.email}</li>
            <li className="text-paper/80">{SITE.phone}</li>
            <li className="text-paper/80">{SITE.location}</li>
            <li><Link className={lnk} to="/info/contact">Contact page</Link></li>
          </ul>
        </div>
      </div>

      <div className="container-x flex flex-col gap-1 border-t border-paper/20 py-5 text-[13px] text-paper/60 sm:flex-row sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Thriftees. All rights reserved.</p>
        <p>Demo storefront: orders are saved in your browser only and no payment is taken.</p>
      </div>

      <div aria-hidden className="pointer-events-none -mb-[3.2vw] select-none whitespace-nowrap text-center font-display text-[19vw] font-extrabold lowercase leading-[0.8] tracking-tighter text-butter">
        thriftees
      </div>
    </footer>
  );
}

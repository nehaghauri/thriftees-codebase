import { Link, useParams } from 'react-router-dom';
import OrderSummary from '../components/OrderSummary';
import { usePageTitle } from '../hooks/usePageTitle';
import type { SummaryItem } from '../types';
import { formatDateTime, formatPKR } from '../utils/format';
import { getOrderById } from '../utils/orders';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const order = getOrderById(orderId);
  usePageTitle(order ? 'Order placed' : 'Order not found');

  if (!order) {
    return (
      <div className="container-x py-20 text-center">
        <h1 className="text-5xl font-extrabold">We cannot find that order</h1>
        <p className="mx-auto mt-3 max-w-md text-ink-soft">Demo orders are only stored in the browser they were placed in, so this link will not work elsewhere.</p>
        <Link to="/shop" className="btn btn-primary mt-7">
          Keep shopping
        </Link>
      </div>
    );
  }

  const items: SummaryItem[] = order.items.map((i) => ({ ...i, id: `${i.productId}-${i.size}` }));

  return (
    <div className="container-x py-10 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-mint shadow-pop">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#151B3B" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12.5 10 17.5 19 7" pathLength={60} strokeDasharray={60} className="animate-draw" />
            </svg>
          </span>
          <div>
            <h1 className="text-5xl font-extrabold leading-none sm:text-6xl">Order placed</h1>
            <p className="mt-2 text-lg text-ink-soft">Thanks, {order.customer.fullName.split(' ')[0]}. Here is your summary.</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border-2 border-dashed border-ink bg-butter/60 p-4 text-sm font-medium">
          This is a demo order. It is saved in this browser only. It has not been sent to a server and no payment has been processed.
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <div className="rounded-2xl border-2 border-ink bg-white p-5 sm:p-6">
              <p className="text-sm text-ink-soft">Order ID</p>
              <p className="mt-1 font-mono text-2xl font-medium tracking-wide">{order.id}</p>
              <p className="mt-1 text-sm text-ink-soft">{formatDateTime(order.placedAt)}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border-2 border-ink bg-white p-5 sm:p-6">
                <h2 className="font-display text-xl font-extrabold">Delivering to</h2>
                <address className="mt-2 not-italic leading-relaxed text-ink/90">
                  {order.customer.fullName}
                  <br />
                  {order.shipping.address}
                  <br />
                  {order.shipping.city}, {order.shipping.province} {order.shipping.postalCode}
                  <br />
                  {order.customer.phone}
                </address>
                {order.shipping.instructions && <p className="mt-3 text-sm text-ink-soft">Note: {order.shipping.instructions}</p>}
              </div>
              <div className="rounded-2xl border-2 border-ink bg-white p-5 sm:p-6">
                <h2 className="font-display text-xl font-extrabold">Payment</h2>
                <p className="mt-2 font-semibold">{order.paymentMethod}</p>
                <p className="mt-1 text-ink-soft">Pay {formatPKR(order.total)} in cash when the order arrives.</p>
                <p className="mt-3 text-sm text-ink-soft">Confirmation for {order.customer.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/shop" className="btn btn-primary">
                Continue shopping
              </Link>
              <Link to="/" className="btn btn-light">
                Back home
              </Link>
            </div>
          </div>

          <OrderSummary items={items} subtotal={order.subtotal} shipping={order.shippingFee} total={order.total} title="What you ordered" />
        </div>
      </div>
    </div>
  );
}

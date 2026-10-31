import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import CheckoutForm from '../components/CheckoutForm';
import OrderSummary from '../components/OrderSummary';
import { useCart } from '../context/CartContext';
import { usePageTitle } from '../hooks/usePageTitle';
import type { CheckoutValues, Order, SummaryItem } from '../types';
import { generateOrderId, saveOrder } from '../utils/orders';
import { EmptyState } from './CartPage';

export default function CheckoutPage() {
  usePageTitle('Checkout');
  const navigate = useNavigate();
  const { lines, subtotal, shipping, total, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);

  if (lines.length === 0) {
    return (
      <div className="container-x py-10">
        <EmptyState title="Nothing to check out" text="Your cart is empty. Add a piece or two first." />
      </div>
    );
  }

  const items: SummaryItem[] = lines.map((l) => ({
    id: l.key,
    productId: l.product.id,
    name: l.product.name,
    size: l.size,
    quantity: l.quantity,
    unitPrice: l.product.price,
    image: l.product.images[0],
  }));

  const placeOrder = (values: CheckoutValues) => {
    if (lines.length === 0 || submitting) return;
    setSubmitting(true);
    const order: Order = {
      id: generateOrderId(),
      placedAt: new Date().toISOString(),
      customer: { fullName: values.fullName, email: values.email, phone: values.phone },
      shipping: { address: values.address, city: values.city, province: values.province, postalCode: values.postalCode, instructions: values.instructions },
      items: items.map(({ productId, name, size, quantity, unitPrice, image }) => ({ productId, name, size, quantity, unitPrice, image })),
      subtotal,
      shippingFee: shipping,
      total,
      paymentMethod: 'Cash on Delivery',
    };
    saveOrder(order);
    clearCart();
    navigate(`/order-confirmation/${order.id}`);
  };

  return (
    <div className="container-x py-8 sm:py-10">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
      <h1 className="mb-8 mt-5 text-5xl font-extrabold sm:text-6xl">Checkout</h1>

      <div className="grid items-start gap-10 lg:grid-cols-[1fr_400px] lg:gap-14">
        <div className="order-2 lg:order-1">
          <CheckoutForm total={total} submitting={submitting} onSubmit={placeOrder} />
          <Link to="/cart" className="mt-8 inline-flex items-center gap-2 font-semibold">
            <ArrowLeft size={16} aria-hidden />
            <span className="link-u">Back to cart</span>
          </Link>
        </div>
        <div className="order-1 lg:sticky lg:top-24 lg:order-2">
          <OrderSummary items={items} subtotal={subtotal} shipping={shipping} total={total} />
        </div>
      </div>
    </div>
  );
}

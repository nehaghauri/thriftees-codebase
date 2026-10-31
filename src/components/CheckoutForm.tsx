import { Banknote } from 'lucide-react';
import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import type { CheckoutValues } from '../types';
import { formatPKR } from '../utils/format';
import { EMPTY_CHECKOUT, PROVINCES, validateCheckout, validateField, type CheckoutErrors } from '../utils/validation';

interface Props {
  total: number;
  submitting: boolean;
  onSubmit: (values: CheckoutValues) => void;
}

interface FieldProps {
  name: keyof CheckoutValues;
  label: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}

function Field({ name, label, error, optional, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className="label">
        {label} {optional && <span className="font-normal text-ink-soft">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="error-text" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default function CheckoutForm({ total, submitting, onSubmit }: Props) {
  const [values, setValues] = useState<CheckoutValues>(EMPTY_CHECKOUT);
  const [errors, setErrors] = useState<CheckoutErrors>({});

  const bind = (name: keyof CheckoutValues) => ({
    id: name,
    name,
    value: values[name],
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
    className: `field ${errors[name] ? 'field-error' : ''}`,
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const next = { ...values, [name]: e.target.value };
      setValues(next);
      // Once a field has shown an error, re-check it as the customer fixes it
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: validateField(name, next) }));
    },
    onBlur: () => setErrors((prev) => ({ ...prev, [name]: validateField(name, values) })),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validateCheckout(values);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }
    onSubmit({ ...values, fullName: values.fullName.trim(), email: values.email.trim(), phone: values.phone.trim(), address: values.address.trim(), city: values.city.trim(), postalCode: values.postalCode.trim(), instructions: values.instructions.trim() });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-9">
      <section aria-labelledby="customer-h">
        <h2 id="customer-h" className="mb-4 font-display text-2xl font-extrabold">Your details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field name="fullName" label="Full name" error={errors.fullName}>
              <input type="text" autoComplete="name" {...bind('fullName')} />
            </Field>
          </div>
          <Field name="email" label="Email address" error={errors.email}>
            <input type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" {...bind('email')} />
          </Field>
          <Field name="phone" label="Phone number" error={errors.phone}>
            <input type="tel" autoComplete="tel" inputMode="tel" placeholder="0300 1234567" {...bind('phone')} />
          </Field>
        </div>
      </section>

      <section aria-labelledby="shipping-h">
        <h2 id="shipping-h" className="mb-4 font-display text-2xl font-extrabold">Delivery address</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field name="address" label="Street address" error={errors.address}>
              <input type="text" autoComplete="street-address" placeholder="House, street, area" {...bind('address')} />
            </Field>
          </div>
          <Field name="city" label="City" error={errors.city}>
            <input type="text" autoComplete="address-level2" {...bind('city')} />
          </Field>
          <Field name="province" label="Province" error={errors.province}>
            <select autoComplete="address-level1" {...bind('province')}>
              <option value="">Choose a province</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>
          <Field name="postalCode" label="Postal code" error={errors.postalCode}>
            <input type="text" inputMode="numeric" autoComplete="postal-code" maxLength={5} placeholder="54000" {...bind('postalCode')} />
          </Field>
          <div className="sm:col-span-2">
            <Field name="instructions" label="Delivery instructions" optional error={errors.instructions}>
              <textarea rows={3} placeholder="Landmark, gate code, best time to call" {...bind('instructions')} />
            </Field>
          </div>
        </div>
      </section>

      <section aria-labelledby="payment-h">
        <h2 id="payment-h" className="mb-4 font-display text-2xl font-extrabold">Payment</h2>
        <label className="flex cursor-pointer items-start gap-3.5 rounded-2xl border-2 border-ink bg-butter/50 p-4">
          <input type="radio" name="payment" value="cod" checked readOnly className="mt-1 h-5 w-5 accent-tomato" />
          <span>
            <span className="flex items-center gap-2 font-display text-lg font-bold">
              <Banknote size={20} aria-hidden /> Cash on delivery
            </span>
            <span className="mt-0.5 block text-sm text-ink-soft">Pay in cash when your order arrives. This is the only payment option for now.</span>
          </span>
        </label>
      </section>

      <div>
        <button type="submit" disabled={submitting} className="btn btn-primary btn-lg w-full sm:w-auto">
          {submitting ? 'Placing order...' : `Place order, ${formatPKR(total)}`}
        </button>
        <p className="mt-3 max-w-md text-[13px] text-ink-soft">
          This is a demo checkout. Your order is saved in this browser only. Nothing is sent to a server and no payment is taken.
        </p>
      </div>
    </form>
  );
}

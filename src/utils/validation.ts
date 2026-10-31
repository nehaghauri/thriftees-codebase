import type { CheckoutValues } from '../types';

export const PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Azad Jammu & Kashmir',
  'Gilgit-Baltistan',
];

export type CheckoutErrors = Partial<Record<keyof CheckoutValues, string>>;

export const EMPTY_CHECKOUT: CheckoutValues = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
  instructions: '',
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Pakistani mobile: 03XXXXXXXXX, +923XXXXXXXXX, 923XXXXXXXXX or 00923XXXXXXXXX
const PK_MOBILE = /^(?:\+92|0092|92|0)3\d{9}$/;

export function validateField(name: keyof CheckoutValues, v: CheckoutValues): string | undefined {
  const value = v[name].trim();
  switch (name) {
    case 'fullName':
      if (!value) return 'Please enter your full name.';
      if (value.length < 3) return 'Name looks a bit short.';
      return;
    case 'email':
      if (!value) return 'Please enter your email address.';
      if (!EMAIL.test(value)) return 'Enter a valid email, like name@example.com.';
      return;
    case 'phone':
      if (!value) return 'Please enter your phone number.';
      if (!PK_MOBILE.test(value.replace(/[\s-]/g, ''))) return 'Enter a Pakistani mobile number, like 0300 1234567.';
      return;
    case 'address':
      if (!value) return 'Please enter your street address.';
      if (value.length < 8) return 'Add a little more detail (house, street, area).';
      return;
    case 'city':
      return value ? undefined : 'Please enter your city.';
    case 'province':
      return value ? undefined : 'Please choose your province.';
    case 'postalCode':
      if (!value) return 'Please enter your postal code.';
      if (!/^\d{5}$/.test(value)) return 'Postal codes in Pakistan have 5 digits.';
      return;
    default:
      return undefined;
  }
}

const REQUIRED: (keyof CheckoutValues)[] = ['fullName', 'email', 'phone', 'address', 'city', 'province', 'postalCode'];

export function validateCheckout(values: CheckoutValues): CheckoutErrors {
  const errors: CheckoutErrors = {};
  for (const key of REQUIRED) {
    const msg = validateField(key, values);
    if (msg) errors[key] = msg;
  }
  return errors;
}

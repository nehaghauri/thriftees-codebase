export interface InfoPageContent {
  slug: string;
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
  /** Shows a banner reminding you to replace the sample copy */
  placeholder?: boolean;
}

export const INFO_PAGES: InfoPageContent[] = [
  {
    slug: 'about',
    title: 'About Thriftees',
    intro: 'We hand-pick pre-loved clothing so you can find something that is actually yours.',
    sections: [
      { heading: 'One of a kind', body: 'Most pieces in the shop exist once. When it is gone, it is gone, so if you love it, grab it.' },
      { heading: 'Checked before it ships', body: 'Every item is cleaned, inspected and graded honestly, so the condition on the page matches what arrives.' },
      { heading: 'Why thrift', body: 'Giving good clothes a second life keeps them in use for longer and keeps your wardrobe more interesting.' },
    ],
    placeholder: true,
  },
  {
    slug: 'shipping',
    title: 'Shipping',
    intro: 'How delivery works at Thriftees.',
    sections: [
      { heading: 'Delivery fee', body: 'A flat fee of PKR 250 applies to every order. Orders of PKR 6,000 or more ship free.' },
      { heading: 'Payment', body: 'Pay in cash when your order arrives. Cash on Delivery is the only payment method for now.' },
      { heading: 'Timing', body: 'Add your delivery timeframes here once you know them.' },
    ],
    placeholder: true,
  },
  {
    slug: 'returns',
    title: 'Returns',
    intro: 'Because most pieces are one of a kind, returns work a little differently.',
    sections: [
      { heading: 'Your policy', body: 'Write your real return and exchange policy here before launch. Thrift stores often offer exchanges or store credit rather than refunds.' },
      { heading: 'Damaged or not as described', body: 'Say how customers should contact you if an item arrives different from its listing.' },
    ],
    placeholder: true,
  },
  {
    slug: 'condition-guide',
    title: 'Condition guide',
    intro: 'Every item carries a condition label. Here is what each one means.',
    sections: [
      { heading: 'Like New', body: 'Worn once or never. No visible wear.' },
      { heading: 'Excellent', body: 'Very light wear. Looks great on.' },
      { heading: 'Good', body: 'Some honest wear like slight fading or soft pilling. Anything notable is mentioned in the description.' },
      { heading: 'Gently Used', body: 'Visible character such as fading or small marks. Priced to match.' },
    ],
  },
  {
    slug: 'care',
    title: 'Care guide',
    intro: 'Simple ways to keep your thrifted pieces looking good.',
    sections: [
      { heading: 'Wash gently', body: 'Cool water and a gentle cycle are kind to older fabrics. Check the care label first.' },
      { heading: 'Knits', body: 'Dry knitwear flat so it keeps its shape.' },
      { heading: 'Denim', body: 'Wash it less often and inside out to hold the colour.' },
    ],
  },
  {
    slug: 'contact',
    title: 'Contact',
    intro: 'Questions about sizing, condition or an order? Get in touch.',
    sections: [
      { heading: 'Email', body: 'Replace this with your real email address in src/data/site.ts.' },
      { heading: 'Phone', body: 'Replace this with your real phone or WhatsApp number in src/data/site.ts.' },
    ],
    placeholder: true,
  },
];

export const getInfoPage = (slug: string | undefined) => INFO_PAGES.find((p) => p.slug === slug);

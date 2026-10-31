/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Thriftees palette: washed-denim paper, indigo ink, price-sticker tomato
        paper: { DEFAULT: '#ECEFF6', deep: '#DDE3F0' },
        ink: { DEFAULT: '#151B3B', soft: '#4B5273', faint: '#8A91AE' },
        tomato: { DEFAULT: '#D63A28', dark: '#B52D1D' },
        butter: '#F7D94C',
        mint: '#BDE5CF',
        pink: '#F6C3D0',
        sky: '#B9CDF2',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Instrument Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        pop: '3px 3px 0 0 #151B3B',
        'pop-lg': '6px 6px 0 0 #151B3B',
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        spinslow: { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
        swing: {
          '0%': { transform: 'rotate(var(--r0, 0deg))' },
          '25%': { transform: 'rotate(calc(var(--r, 0deg) * -0.9))' },
          '50%': { transform: 'rotate(calc(var(--r, 0deg) * 0.55))' },
          '75%': { transform: 'rotate(calc(var(--r, 0deg) * -0.25))' },
          '100%': { transform: 'rotate(0deg)' },
        },
        drop: {
          '0%': { transform: 'translateY(-60px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pop: { '0%': { transform: 'scale(1)' }, '40%': { transform: 'scale(1.35)' }, '100%': { transform: 'scale(1)' } },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        slidein: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
        fadein: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        draw: { '0%': { strokeDashoffset: '60' }, '100%': { strokeDashoffset: '0' } },
      },
      animation: {
        marquee: 'marquee 45s linear infinite',
        spinslow: 'spinslow 28s linear infinite',
        swing: 'swing 1.6s ease-out 1',
        drop: 'drop 0.7s cubic-bezier(.2,.9,.3,1.2) both',
        pop: 'pop 0.35s ease-out',
        shake: 'shake 0.3s ease-in-out',
        slidein: 'slidein 0.28s cubic-bezier(.2,.8,.2,1)',
        fadein: 'fadein 0.2s ease-out',
        draw: 'draw 0.6s 0.15s ease-out both',
      },
    },
  },
  plugins: [],
};

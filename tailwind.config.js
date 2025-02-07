/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-1': '#F4A261',
        'brand-2': '#FDEDDB',
        'brand-3': '#FF6F61',
        'brand-4': '#3E4C59',
        'brand-5': '#6C757D',
        'brand-6': '#222831',
        'brand-7': '#1B263B',
        'brand-8': '#0FA3B1',
        'brand-9': '#B8C5D6',
        'brand-10': '#D6F5E8',
        'brand-11': '#D9D9D9',
        'brand-12': '#F0F0F0',
        'brand-13': '#F12F2F',
        'brand-14': '#F8F9FA',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

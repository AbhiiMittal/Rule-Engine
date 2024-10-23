/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Update this based on your project structure
    './node_modules/@shadcn/ui/**/*.{js,ts,jsx,tsx}', // For shadcn/ui components
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

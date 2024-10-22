/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  darkMode: [
    'variant',
    [
      '@media (prefers-color-scheme: dark) {& *}',
      '&:is(.my-app-dark *)'
    ]
  ],
  theme: {
    extend: {},
    fontFamily: {
      'sans': ['Geist Sans', 'system-ui','sans-serif'],
      'mono': ['Geist Mono', 'ui-monospace'],
    }
  },
  plugins: [require('tailwindcss-primeui')]
}
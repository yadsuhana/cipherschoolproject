/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'editor-bg': '#1e1e1e',
        'editor-sidebar': '#252526',
        'editor-border': '#3e3e42',
        'editor-tab': '#2d2d30',
        'editor-tab-active': '#1e1e1e',
      }
    },
  },
  plugins: [],
}

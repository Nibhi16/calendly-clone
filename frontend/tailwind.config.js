/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        primary: '#2563eb',
        'primary-hover': '#1d4ed8',
        'primary-soft': '#eff6ff',
        border: '#e5e7eb',
        danger: '#ef4444',
        'danger-hover': '#dc2626',
        muted: '#6b7280'
      },
      backgroundColor: {
        'page': '#f8fafc',
        'card': '#ffffff'
      }
    }
  },
  plugins: []
};


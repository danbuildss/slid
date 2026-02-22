import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme colors
        background: 'var(--background)',
        surface: 'var(--surface)',
        'surface-light': 'var(--surface-light)',
        border: 'var(--border)',
        primary: '#00D47E',
        'primary-hover': '#00B86B',
        'primary-light': 'var(--primary-light)',
        secondary: '#3B82F6',
        foreground: 'var(--foreground)',
        muted: 'var(--muted)',
        dim: 'var(--dim)',
        // Status colors
        success: '#00D47E',
        warning: '#FFC107',
        danger: '#DC3545',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config

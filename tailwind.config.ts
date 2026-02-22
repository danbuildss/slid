import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light theme colors (like InvoiceJet)
        background: '#F8F9FA',
        surface: '#FFFFFF',
        'surface-light': '#F1F3F5',
        border: '#E9ECEF',
        primary: '#00D47E',
        'primary-hover': '#00B86B',
        'primary-light': '#E6FBF3',
        secondary: '#3B82F6',
        foreground: '#212529',
        muted: '#6C757D',
        dim: '#ADB5BD',
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

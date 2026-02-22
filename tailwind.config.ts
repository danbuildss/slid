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
        background: '#0A0A0B',
        surface: '#141416',
        'surface-light': '#1C1C1F',
        border: '#2A2A2D',
        primary: '#00D47E',
        'primary-hover': '#00B86B',
        secondary: '#3B82F6',
        foreground: '#FAFAFA',
        muted: '#71717A',
        dim: '#52525B',
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

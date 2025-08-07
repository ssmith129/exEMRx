/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0efff', 
          200: '#b8deff',
          300: '#7cc4ff',
          400: '#36a7ff',
          500: '#0066cc',
          600: '#0052a3',
          700: '#003d7a',
          800: '#002952',
          900: '#001529'
        },
        accent: {
          50: '#f0fdf9',
          100: '#ccfbef',
          200: '#99f6e0',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a'
        },
        healthcare: {
          trust: '#0066cc',
          growth: '#14b8a6', 
          warning: '#f59e0b',
          critical: '#ef4444',
          success: '#10b981',
          neutral: '#6b7280'
        },
        secondary: {
          50: '#fafbfc',
          100: '#f4f6f8',
          200: '#e8ecf0',
          300: '#d2d9e0',
          400: '#9ea8b4',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#0f172a'
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '18px', letterSpacing: '0.02em' }],
        'sm': ['14px', { lineHeight: '22px', letterSpacing: '0.01em' }], 
        'base': ['16px', { lineHeight: '26px', letterSpacing: '0' }],
        'lg': ['18px', { lineHeight: '30px', letterSpacing: '-0.01em' }],
        'xl': ['20px', { lineHeight: '32px', letterSpacing: '-0.01em' }],
        '2xl': ['24px', { lineHeight: '36px', letterSpacing: '-0.02em' }],
        '3xl': ['32px', { lineHeight: '44px', letterSpacing: '-0.02em' }],
        '4xl': ['40px', { lineHeight: '48px', letterSpacing: '-0.03em' }],
        '5xl': ['48px', { lineHeight: '56px', letterSpacing: '-0.03em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '96': '24rem',
        '128': '32rem'
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px'
      },
      borderWidth: {
        '3': '3px'
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'float': 'float 3s ease-in-out infinite'
      },
      zIndex: {
        '60': '60',
        '70': '70'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      }
    },
  },
  plugins: [],
};
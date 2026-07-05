/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#AE2119',
          'red-dark': '#8B1A13',
          'red-light': '#C9261C',
          gray: '#898989',
          'gray-light': '#EAECEC',
          black: '#000000',
        },
        accent: {
          yellow: '#F5C518',
          orange: '#FF6B35',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'Tahoma', 'sans-serif'],
        body: ['Tahoma', 'Poppins', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'slide-in-left': 'slideInLeft 0.8s ease-out forwards',
        'slide-in-right': 'slideInRight 0.8s ease-out forwards',
        'fade-up': 'fadeUp 0.7s ease-out forwards',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(174, 33, 25, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(174, 33, 25, 0.8), 0 0 80px rgba(174, 33, 25, 0.3)' },
        },
        slideInLeft: {
          from: { transform: 'translateX(-100px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          from: { transform: 'translateX(100px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        fadeUp: {
          from: { transform: 'translateY(40px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

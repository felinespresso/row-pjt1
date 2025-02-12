/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "blue-1": "#244491",
        "blue-2": "#2D3CE8",
        "blue-3": "#212FCAFF",
        "green-1": "#009A0A",
        "green-2": "#008209FF",
        color1: '#D1F2FF', 
        color2: '#00B0FF', 
        color3: '#2D3CE8', 
        color4: '#A7E6FF', 
        color5: '#779FE5', 
        color6: '#3572EF', 
        color7: '#244491', 
        color8: '#030CD0', 
        color9: '#D9D9D9', 
      }, 
      fontFamily: { 
        montserrat: ['Montserrat', 'sans-serif'], 
      },
      textShadow: { 
        'custom': '-4px 4px 9px 0 rgba(0, 0, 0, 0.5)', 
      }, 
      boxShadow: { 
        custom: '-5px 5px 6px 0 rgba(71, 71, 71, 0.4)', 
        box: '14px 14px 4px 0px rgba(0, 0, 0, 0.25)' 
      }, 
      keyframes: { 
        popIn: { 
          '0%': { 
            transform: 'scale(0.50)', 
            opacity: '0.5' 
          }, 
          '50%': { 
            transform: 'scale(0.70)', 
            opacity: '1' 
          }, 
          '100%': { 
            transform: 'scale(1)', 
            opacity: '1' 
          }, 
        }, 
      }, 
      animation: { 
        popIn: 'popIn 0.3s ease-out forwards', 
      },
    },
  },
  plugins: [],
};

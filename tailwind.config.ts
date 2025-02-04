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
        "blue-4": "#1A26A9FF",
        "blue-5": "#779FE5",
        "green-1": "#009A0A",
        "green-2": "#008209FF",
        "gray-1": "#797979",
      },
    },
  },
  plugins: [],
};

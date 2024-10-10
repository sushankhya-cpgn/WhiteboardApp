/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        underline: "#636ae8",
      },
      cursor: {
        pencil: "url(hand.cur), pointer",
      },
    },
  },
  plugins: [],
};

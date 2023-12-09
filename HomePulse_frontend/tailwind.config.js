/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        glass: "rgba(255, 255, 255, 0, 255)",
        brown: "rgb(30, 30, 17)"
      }
    },
    backgroundImage: {
      back: "url(./src/assets/blurry-gradient-haikei.svg)"
    }
  },
  plugins: [],
}
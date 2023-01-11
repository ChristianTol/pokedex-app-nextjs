module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        statSlideIn: {
          "0%": { maxWidth: "5%" },
          "100%": { maxWidth: "100%" },
        },
      },
    },
  },
  plugins: [],
};

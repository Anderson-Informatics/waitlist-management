/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      fontSize: {
        "2xs": [
          ".75rem",
          {
            lineHeight: ".85rem",
            letterSpacing: "-0.01em",
          },
        ],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

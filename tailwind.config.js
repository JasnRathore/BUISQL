/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      borderWidth: {
        "0.2": "0.2px",
        "0.5": "0.5px",
      },
      padding: {
        "7.5": "30px",
      },
    },
  },
  plugins: [],
}


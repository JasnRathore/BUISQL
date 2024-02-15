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
      colors: {
        "GitBg":"#24292e",
      },
      margin: {
        "1p": "1px",
        "2p": "2px",
      },
      transitionDuration: {
        '50': '50ms',
      },
    },
  },
  plugins: [],
}


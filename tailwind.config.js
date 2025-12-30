/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
     screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
      
      "xl-max": { max: "1440px" },
      "lg-max": { max: "1024px" },
      "md-max": { max: "768px" },
      "sm-max": { max: "576px" },
    },

    extend: {
      colors: {
        'xd-yellow': '#F2B900',
        'xd-dark': '#1A1A1A',
      },
    },
  },
  plugins: [],
}
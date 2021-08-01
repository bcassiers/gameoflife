module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        embie: {
          blue: "#161644",
          red: "#EA492E",
          yellow: "#FFAF23",
          lightblue: "#60A1E2",
          purple: "#CDA7EA",
          grey: "#F2F2F2",
        },
      },
      fontFamily: {
        recoleta: "Recoleta",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        //backgrounds-colors
        bgDark: "#111827",
        bgLight: "#e2e8f0",
      },
    },
  },
  plugins: [],
};

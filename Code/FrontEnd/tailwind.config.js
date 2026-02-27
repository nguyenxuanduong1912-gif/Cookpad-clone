/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    "bg-[#f93]",
    "text-[#fff]",
    "border-[#f93]",
    "px-[24px]",
    "px-[40px]",
    "py-[8px]",
    "py-[12px]",
    "border-[#FF9933]",
    "text-[#FF9933]",
    "border-[#cececd]",
    "text-[#FE463A]",
    "border-[#FE463A]",
    "border-[#fff]",
    "bg-[#4a4a49]",
    "bg-[#EA284E]",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },
      keyframes: {
        slideDown: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        rotate: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        slideDown: "slideDown 0.5s ease-out forwards",
        rotate: "rotate 1s ease-out forwards infinite",
      },
    },
  },
  plugins: [],
};

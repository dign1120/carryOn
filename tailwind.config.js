/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        thin: ['Pretendard-Thin'],
        extralight: ['Pretendard-ExtraLight'],
        light: ['Pretendard-Light'],
        regular: ['Pretendard-Regular'],
        medium: ['Pretendard-Medium'],
        semibold: ['Pretendard-SemiBold'],
        bold: ['Pretendard-Bold'],
        extrabold: ['Pretendard-ExtraBold'],
        black: ['Pretendard-Black'],
        sans: ['Pretendard-Regular'],
      },
    },
  },
  plugins: [],
};

/** @type {import("prettier").Config} */
const config = {
  useTabs: true,
	singleQuote: true,
	printWidth: 120,
	bracketSpacing: false,
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
};

module.exports = config;

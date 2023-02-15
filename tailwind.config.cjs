const colors = require('tailwindcss/colors');

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ['Nanum Pen Script'],
			},
			colors: {
				base: colors.neutral,
			},
		},
	},

	plugins: [],
};

module.exports = config;

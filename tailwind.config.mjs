/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				'sans': ['Noto Sans JP', 'Noto Sans SC', ...defaultTheme.fontFamily.sans]
			}
		},
	},
	plugins: [
		typography,
		forms,
	],
}

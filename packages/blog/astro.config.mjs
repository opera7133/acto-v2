import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";
import { remarkAlert } from "remark-github-blockquote-alert";
import pagefind from "astro-pagefind";
import rehypeRaw from "rehype-raw";
import rehypeExternalLinks from "rehype-external-links";
import linkCard from "astro-link-card";
import { unified } from "@astrojs/markdown-remark";

// https://astro.build/config
export default defineConfig({
	site: "https://blog.wmsci.com",
	integrations: [mdx(), sitemap(), icon(), pagefind(), linkCard()],
	build: {
		format: "file",
	},
	markdown: {
		processor: unified({
			remarkPlugins: [remarkAlert],
			rehypePlugins: [rehypeRaw, [rehypeExternalLinks, { target: "_blank" }]],
			remarkRehype: {
				footnoteLabel: "脚注",
			},
		}),
		shikiConfig: {
			theme: "monokai",
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: "Noto Sans SC",
			cssVariable: "--font-noto-sans-sc",
			fallbacks: [],
		},
		{
			provider: fontProviders.fontsource(),
			name: "Noto Sans JP",
			cssVariable: "--font-noto-sans-jp",
			fallbacks: [],
		},
	],
});

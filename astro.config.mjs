import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from "astro-icon";
import tailwind from "@astrojs/tailwind";
import rehypeBudouxParagraph from "rehype-budoux-paragraph";

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.wmsci.com',
  integrations: [mdx(), sitemap(), tailwind(), icon()],
  markdown: {
    rehypePlugins: [rehypeBudouxParagraph],
  }
});

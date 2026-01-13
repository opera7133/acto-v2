import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";
import { remarkAlert } from "remark-github-blockquote-alert";
import pagefind from "astro-pagefind";
import rlc from "remark-link-card";
import rehypeRaw from "rehype-raw";
import rehypeExternalLinks from "rehype-external-links";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.wmsci.com",
  integrations: [mdx(), sitemap(), icon(), pagefind()],
  build: {
    format: "file",
  },
  markdown: {
    remarkPlugins: [remarkAlert, [rlc, { cache: false, shortenUrl: true }]],
    rehypePlugins: [rehypeRaw, [rehypeExternalLinks, { target: "_blank" }]],
    shikiConfig: {
      theme: "monokai",
    },
    remarkRehype: {
      footnoteLabel: "脚注",
    },
  },
  vite: {
    plugins: [tailwindcss()],
  }
});

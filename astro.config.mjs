import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import tailwind from "@astrojs/tailwind";
import { remarkAlert } from "remark-github-blockquote-alert";

import linkCard from "astro-link-card";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.wmsci.com",
  integrations: [mdx(), sitemap(), tailwind(), icon(), linkCard()],
  markdown: {
    remarkPlugins: [remarkAlert],
    shikiConfig: {
      theme: "monokai",
    },
    remarkRehype: {
      footnoteLabel: "脚注",
    },
  },
});

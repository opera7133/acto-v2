import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.string().optional(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.preprocess(
        (value) => (value === "" ? undefined : value),
        z.coerce.date().optional(),
      ),
      heroImage: z.preprocess(
        (value) => (value === "" ? undefined : value),
        image().optional(),
      ),
      draft: z.boolean().optional(),
    }),
});

export const collections = { blog };

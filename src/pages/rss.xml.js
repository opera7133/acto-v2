import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { format } from "date-fns";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";

export async function GET(context) {
  const posts = (await getCollection("blog"))
    .sort((a, b) => b.data.pubDate - a.data.pubDate)
    .filter((post) => !post.data.draft);
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      description: post.body.slice(0, 80).concat("...").replaceAll("#", ""),
      link: `${format(post.data.pubDate, "/yyyy/MM/")}${post.slug}`,
    })),
  });
}

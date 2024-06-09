import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import getSortedStudies from "@utils/getSortedStudies";
import { SITE } from "@config";

export async function GET() {
  const studies = await getCollection("studies");
  const sortedStudies = getSortedStudies(studies);
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: sortedStudies.map(({ data, slug }) => ({
      link: `studies/${slug}/`,
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
}

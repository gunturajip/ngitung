import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { generateOgImageForStudy } from "@utils/generateOgImages";
import { slugifyStr } from "@utils/slugify";

export async function getStaticPaths() {
  const studies = await getCollection("blog").then(p =>
    p.filter(({ data }) => !data.draft && !data.ogImage)
  );

  return studies.map(study => ({
    params: { slug: slugifyStr(study.data.title) },
    props: study,
  }));
}

export const GET: APIRoute = async ({ props }) =>
  new Response(await generateOgImageForStudy(props as CollectionEntry<"blog">), {
    headers: { "Content-Type": "image/png" },
  });

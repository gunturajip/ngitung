import type { CollectionEntry } from "astro:content";
import getSortedStudies from "./getSortedStudies";
import { slugifyAll } from "./slugify";

const getStudiesByTag = (studies: CollectionEntry<"studies">[], tag: string) =>
  getSortedStudies(
    studies.filter(study => slugifyAll(study.data.tags).includes(tag))
  );

export default getStudiesByTag;

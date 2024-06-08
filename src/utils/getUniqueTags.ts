import { slugifyStr } from "./slugify";
import type { CollectionEntry } from "astro:content";
import studyFilter from "./studyFilter";

interface Tag {
  tag: string;
  tagName: string;
}

const getUniqueTags = (studies: CollectionEntry<"blog">[]) => {
  const tags: Tag[] = studies
    .filter(studyFilter)
    .flatMap(study => study.data.tags)
    .map(tag => ({ tag: slugifyStr(tag), tagName: tag }))
    .filter(
      (value, index, self) =>
        self.findIndex(tag => tag.tag === value.tag) === index
    )
    .sort((tagA, tagB) => tagA.tag.localeCompare(tagB.tag));
  return tags;
};

export default getUniqueTags;

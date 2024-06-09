import type { CollectionEntry } from "astro:content";
import studyFilter from "./studyFilter";

const getSortedStudies = (studies: CollectionEntry<"studies">[]) => {
  return studies
    .filter(studyFilter)
    .sort(
      (a, b) =>
        Math.floor(
          new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() / 1000
        ) -
        Math.floor(
          new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime() / 1000
        )
    );
};

export default getSortedStudies;

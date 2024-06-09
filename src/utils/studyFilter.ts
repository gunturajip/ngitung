import { SITE } from "@config";
import type { CollectionEntry } from "astro:content";

const studyFilter = ({ data }: CollectionEntry<"studies">) => {
  const isPublishTimePassed =
    Date.now() >
    new Date(data.pubDatetime).getTime() - SITE.scheduledStudyMargin;
  return !data.draft && (import.meta.env.DEV || isPublishTimePassed);
};

export default studyFilter;

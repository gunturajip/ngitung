---
title: How to add an estimated reading time in AstroPaper
author: Sat Naing
pubDatetime: 2023-07-21T10:11:06.130Z
modDatetime: 2024-01-03T14:53:25Z
slug: how-to-add-estimated-reading-time
featured: false
draft: false
tags:
  - FAQ
description: How you can add an 'Estimated Reading time' in your blog studies of AstroPaper.
---

As the [Astro docs](https://docs.astro.build/en/recipes/reading-time/) say, we can use remark plugin to add a reading time property in our frontmatter. However, for some reason, we can't add this feature by following what stated in Astro docs. Therefore, to achieve this, we have to tweak a little bit. This study will demonstrate how we can do that.

## Table of contents

## Add reading time in StudyDetails

Step (1) Install required dependencies.

```bash
npm install reading-time mdast-util-to-string
```

Step (2) Create `remark-reading-time.mjs` file under `utils` directory

```js
import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";

export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    data.astro.frontmatter.readingTime = readingTime.text;
  };
}
```

Step (3) Add the plugin to `astro.config.ts`

```js
import { remarkReadingTime } from "./src/utils/remark-reading-time.mjs"; // make sure your relative path is correct

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    // other integrations
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      remarkReadingTime, // 👈🏻 our plugin
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    // other config
  },
  // other config
});
```

Step (4) Add `readingTime` to blog schema (`src/content/config.ts`)

```ts
import { SITE } from "@config";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      // others...
      canonicalURL: z.string().optional(),
      readingTime: z.string().optional(), // 👈🏻 readingTime frontmatter
    }),
});

export const collections = { blog };
```

Step (5) Create a new file called `getStudiesWithRT.ts` under `src/utils` directory.

```ts
import type { MarkdownInstance } from "astro";
import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "./slugify";

export const getReadingTime = async () => {
  // Get all studies using glob. This is to get the updated frontmatter
  const globStudies = import.meta.glob("../content/blog/*.md") as Promise<
    CollectionEntry<"blog">["data"][]
  >;

  // Then, set those frontmatter value in a JS Map with key value pair
  const mapFrontmatter = new Map();
  const globStudiesValues = Object.values(globStudies);
  await Promise.all(
    globStudiesValues.map(async globStudy => {
      const { frontmatter } = await globStudy();
      mapFrontmatter.set(
        slugifyStr(frontmatter.title),
        frontmatter.readingTime
      );
    })
  );

  return mapFrontmatter;
};

const getStudiesWithRT = async (studies: CollectionEntry<"blog">[]) => {
  const mapFrontmatter = await getReadingTime();
  return studies.map(study => {
    study.data.readingTime = mapFrontmatter.get(slugifyStr(study.data.title));
    return study;
  });
};

export default getStudiesWithRT;
```

Step (6) Refactor `getStaticPaths` of `/src/pages/studies/[slug].astro` as the following

```ts
---
// other imports
import getStudiesWithRT from "@utils/getStudiesWithRT";

export interface Props {
  study: CollectionEntry<"blog">;
}

export async function getStaticPaths() {
  const studies = await getCollection("blog", ({ data }) => !data.draft);

  const studiesWithRT = await getStudiesWithRT(studies); // replace reading time logic with this func

   const studyResult = studiesWithRT.map(study => ({ // make sure to replace studies with studiesWithRT
    params: { slug: study.slug },
    props: { study },
  }));

// other codes
```

Step (7) Refactor `StudyDetails.astro` like this. Now you can access and display `readingTime` in `StudyDetails.astro`

```ts
---
// imports

export interface Props {
  study: CollectionEntry<"blog">;
}

const { study } = Astro.props;

const {
  title,
  author,
  description,
  ogImage,
  readingTime, // we can now directly access readingTime from frontmatter
  pubDatetime,
  modDatetime,
  tags } = study.data;

// other codes
---
```

## Access reading time outside of StudyDetails (optional)

By following the previous steps, you can now access `readingTime` frontmatter property in you study details page. Sometimes, this is exactly what you want. If so, you can skip to the next section. However, if you want to display "estimated reading time" in index, studies, and technically everywhere, you need to do the following extra steps.

Step (1) Update `utils/getSortedStudies.ts` as the following

```ts
import type { CollectionEntry } from "astro:content";
import getStudiesWithRT from "./getStudiesWithRT";

const getSortedStudies = async (studies: CollectionEntry<"blog">[]) => {
  // make sure that this func is async
  const studiesWithRT = await getStudiesWithRT(studies); // add reading time
  return studiesWithRT
    .filter(({ data }) => !data.draft)
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
```

Step (2) Make sure to refactor every file which uses `getSortedStudies` function. You can simply add `await` keyword in front of `getSortedStudies` function.

Files that use `getSortedStudies` function are as follow

- src/pages/index.astro
- src/pages/studies/index.astro
- src/pages/rss.xml.ts
- src/pages/studies/index.astro
- src/pages/studies/[slug].astro
- src/utils/getStudiesByTag.ts

All you have to do is like this

```ts
const sortedStudies= getSortedStudies(studies); // old code ❌
const sortedStudies = await getSortedStudies(studies); // new code ✅
```

Now you can access `readingTime` in other places besides `StudyDetails`

## Displaying reading time (optional)

Since you can now access `readingTime` in your study details (or everywhere if you do the above section), it's up to you to display `readingTime` wherever you want.

But in this section, I'm gonna show you how I would display `readingTime` in my components. This is optional. You can ignore this section if you want.

Step (1) Update `Datetime` component to display `readingTime`

```tsx
import { LOCALE } from "@config";

export interface Props {
  datetime: string | Date;
  size?: "sm" | "lg";
  className?: string;
  readingTime?: string; // new type
}

export default function Datetime({
  datetime,
  size = "sm",
  className,
  readingTime, // new prop
}: Props) {
  return (
    // other codes
    <span className={`italic ${size === "sm" ? "text-sm" : "text-base"}`}>
      <FormattedDatetime pubDatetime={pubDatetime} modDatetime={modDatetime} />
      <span> ({readingTime})</span> {/* display reading time */}
    </span>
    // other codes
  );
}
```

Step (2) Then, pass `readingTime` props from its parent component.

file: Card.tsx

```ts
export default function Card({ href, frontmatter, secHeading = true }: Props) {
  const { title, pubDatetime, modDatetime description, readingTime } = frontmatter;
  return (
    ...
    <Datetime
      pubDatetime={pubDatetime}
      modDatetime={modDatetime}
      readingTime={readingTime}
    />
    ...
  );
}
```

file: StudyDetails.tsx

```jsx
// Other Codes
<main id="main-content">
  <h1 class="study-title">{title}</h1>
  <Datetime
    pubDatetime={pubDatetime}
    modDatetime={modDatetime}
    size="lg"
    className="my-2"
    readingTime={readingTime}
  />
  {/* Other Codes */}
</main>
// Other Codes
```

## Conclusion

By following the provided steps and tweaks, you can now incorporate this useful feature into your content. I hope this study helps you adding `readingTime` in your blog. AstroPaper might include reading time by default in future releases. 🤷🏻‍♂️

Kyay Zuu for Reading 🙏🏻

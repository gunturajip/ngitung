---
author: Sat Naing
pubDatetime: 2022-09-23T15:22:00Z
modDatetime: 2023-12-21T09:12:47.400Z
title: Adding new studies in AstroPaper theme
slug: adding-new-studies-in-astropaper-theme
featured: true
draft: false
tags:
  - docs
description:
  Some rules & recommendations for creating or adding new studies using AstroPaper
  theme.
---

Here are some rules/recommendations, tips & ticks for creating new studies in AstroPaper blog theme.

## Table of contents

## Frontmatter

Frontmatter is the main place to store some important information about the blog study (article). Frontmatter lies at the top of the article and is written in YAML format. Read more about frontmatter and its usage in [astro documentation](https://docs.astro.build/en/guides/markdown-content/).

Here is the list of frontmatter property for each study.

| Property           | Description                                                                                 | Remark                                        |
| ------------------ | ------------------------------------------------------------------------------------------- | --------------------------------------------- |
| **_title_**        | Title of the study. (h1)                                                                     | required<sup>\*</sup>                         |
| **_description_**  | Description of the study. Used in study excerpt and site description of the study.             | required<sup>\*</sup>                         |
| **_pubDatetime_**  | Published datetime in ISO 8601 format.                                                      | required<sup>\*</sup>                         |
| **_modDatetime_**  | Modified datetime in ISO 8601 format. (only add this property when a blog study is modified) | optional                                      |
| **_author_**       | Author of the study.                                                                         | default = SITE.author                         |
| **_slug_**         | Slug for the study. This field is optional but cannot be an empty string. (slug: ""❌)       | default = slugified file name                 |
| **_featured_**     | Whether or not display this study in featured section of home page                           | default = false                               |
| **_draft_**        | Mark this study 'unpublished'.                                                               | default = false                               |
| **_tags_**         | Related keywords for this study. Written in array yaml format.                               | default = others                              |
| **_ogImage_**      | OG image of the study. Useful for social media sharing and SEO.                              | default = SITE.ogImage or generated OG image  |
| **_canonicalURL_** | Canonical URL (absolute), in case the article already exists on other source.               | default = `Astro.site` + `Astro.url.pathname` |

> Tip! You can get ISO 8601 datetime by running `new Date().toISOString()` in the console. Make sure you remove quotes though.

Only `title`, `description` and `pubDatetime` fields in frontmatter must be specified.

Title and description (excerpt) are important for search engine optimization (SEO) and thus AstroPaper encourages to include these in blog studies.

`slug` is the unique identifier of the url. Thus, `slug` must be unique and different from other studies. The whitespace of `slug` should to be separated with `-` or `_` but `-` is recommended. Slug is automatically generated using the blog study file name. However, you can define your `slug` as a frontmatter in your blog study.

For example, if the blog file name is `adding-new-study.md` and you don't specify the slug in your frontmatter, Astro will automatically create a slug for the blog study using the file name. Thus, the slug will be `adding-new-study`. But if you specify the `slug` in the frontmatter, this will override the default slug. You can read more about this in [Astro Docs](https://docs.astro.build/en/guides/content-collections/#defining-custom-slugs).

If you omit `tags` in a blog study (in other words, if no tag is specified), the default tag `others` will be used as a tag for that study. You can set the default tag in the `/src/content/config.ts` file.

```ts
// src/content/config.ts
export const blogSchema = z.object({
  // ---
  draft: z.boolean().optional(),
  tags: z.array(z.string()).default(["others"]), // replace "others" with whatever you want
  // ---
});
```

### Sample Frontmatter

Here is the sample frontmatter for a study.

```yaml
# src/content/studies/sample-study.md
---
title: The title of the study
author: your name
pubDatetime: 2022-09-21T05:17:19Z
slug: the-title-of-the-study
featured: true
draft: false
tags:
  - some
  - example
  - tags
ogImage: ""
description: This is the example description of the example study.
canonicalURL: https://example.org/my-article-was-already-studyed-here
---
```

## Adding table of contents

By default, a study (article) does not include any table of contents (toc). To include toc, you have to specify it in a specific way.

Write `Table of contents` in h2 format (## in markdown) and place it where you want it to be appeared on the study.

For instance, if you want to place your table of contents just under the intro paragraph (like I usually do), you can do that in the following way.

```md
---
# some frontmatter
---

Here are some recommendations, tips & ticks for creating new studies in AstroPaper blog theme.

## Table of contents

<!-- the rest of the study -->
```

## Headings

There's one thing to note about headings. The AstroPaper blog studies use title (title in the frontmatter) as the main heading of the study. Therefore, the rest of the heading in the study should be using h2 \~ h6.

This rule is not mandatory, but highly recommended for visual, accessibility and SEO purposes.

## Storing Images for Blog Content

Here are two methods for storing images and displaying them inside a markdown file.

> Note! If it's a requirement to style optimized images in markdown you should [use MDX](https://docs.astro.build/en/guides/images/#images-in-mdx-files).

### Inside `src/assets/` directory (recommended)

You can store images inside `src/assets/` directory. These images will be automatically optimized by Astro through [Image Service API](https://docs.astro.build/en/reference/image-service-reference/).

You can use relative path or alias path (`@assets/`) to serve these images.

Example: Suppose you want to display `example.jpg` whose path is `/src/assets/images/example.jpg`.

```md
![something](@assets/images/example.jpg)

<!-- OR -->

![something](../../assets/images/example.jpg)

<!-- Using img tag or Image component won't work ❌ -->
<img src="@assets/images/example.jpg" alt="something">
<!-- ^^ This is wrong -->
```

> Technically, you can store images inside any directory under `src`. In here, `src/assets` is just a recommendation.

### Inside `public` directory

You can store images inside the `public` directory. Keep in mind that images stored in the `public` directory remain untouched by Astro, meaning they will be unoptimized and you need to handle image optimization by yourself.

For these images, you should use an absolute path; and these images can be displayed using [markdown annotation](https://www.markdownguide.org/basic-syntax/#images-1) or [HTML img tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img).

Example: Assume `example.jpg` is located at `/public/assets/images/example.jpg`.

```md
![something](/assets/images/example.jpg)

<!-- OR -->

<img src="/assets/images/example.jpg" alt="something">
```

## Bonus

### Image compression

When you put images in the blog study (especially for images under `public` directory), it is recommended that the image is compressed. This will affect the overall performance of the website.

My recommendation for image compression sites.

- [TinyPng](https://tinypng.com/)
- [TinyJPG](https://tinyjpg.com/)

### OG Image

The default OG image will be placed if a study does not specify the OG image. Though not required, OG image related to the study should be specify in the frontmatter. The recommended size for OG image is **_1200 X 640_** px.

> Since AstroPaper v1.4.0, OG images will be generated automatically if not specified. Check out [the announcement](https://astro-paper.pages.dev/studies/dynamic-og-image-generation-in-astropaper-blog-studies/).
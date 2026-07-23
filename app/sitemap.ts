import type { MetadataRoute } from "next";
import { getPublishedBlogs } from "@/lib/blog";
import { getPublishedKbPages } from "@/lib/knowledge-base";
import { getPublishedProjects } from "@/lib/projects";
import { getPublishedArchitecture } from "@/lib/architecture";
import { getKbCategoriesWithContent, getKbTopicsForCategory } from "@/lib/knowledge-base";
import { getAllTags } from "@/lib/blog";
import { categories } from "@/lib/taxonomy";

import { SITE_URL } from "@/lib/site-config";

const BASE_URL = SITE_URL;

// Real enumeration of every published slug across all four content types,
// replacing the Step 2 hardcoded placeholder array. Runs at build time
// against the same Content Collections data every page already uses, so a
// new post/project/reference is in the sitemap the moment it's published —
// no separate list to keep in sync.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/blog`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/knowledge-base`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/projects`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/architecture`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/search`, changeFrequency: "monthly", priority: 0.2 },
  ];

  const blogPages: MetadataRoute.Sitemap = getPublishedBlogs().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt ?? post.publishedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogCategoryPages: MetadataRoute.Sitemap = categories
    .filter((c) => getPublishedBlogs().some((p) => p.category === c.slug))
    .map((c) => ({
      url: `${BASE_URL}/blog/category/${c.slug}`,
      changeFrequency: "weekly",
      priority: 0.5,
    }));

  const blogTagPages: MetadataRoute.Sitemap = getAllTags(getPublishedBlogs()).map(
    (tag) => ({
      url: `${BASE_URL}/blog/tag/${tag}`,
      changeFrequency: "weekly",
      priority: 0.4,
    })
  );

  const kbCategoryPages: MetadataRoute.Sitemap = getKbCategoriesWithContent().map(
    (c) => ({
      url: `${BASE_URL}/knowledge-base/${c.slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    })
  );

  const kbTopicPages: MetadataRoute.Sitemap = getKbCategoriesWithContent().flatMap((c) =>
    getKbTopicsForCategory(c.slug).map((t) => ({
      url: `${BASE_URL}/knowledge-base/${c.slug}/${t.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  );

  const kbArticlePages: MetadataRoute.Sitemap = getPublishedKbPages().map((doc) => ({
    url: `${BASE_URL}/knowledge-base/${doc.slug}`,
    lastModified: doc.updatedAt ?? doc.publishedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const projectPages: MetadataRoute.Sitemap = getPublishedProjects().map((p) => ({
    url: `${BASE_URL}/projects/${p.slug}`,
    lastModified: p.updatedAt ?? p.publishedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const architecturePages: MetadataRoute.Sitemap = getPublishedArchitecture().map(
    (doc) => ({
      url: `${BASE_URL}/architecture/${doc.slug}`,
      lastModified: doc.updatedAt ?? doc.publishedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    })
  );

  return [
    ...staticPages,
    ...blogPages,
    ...blogCategoryPages,
    ...blogTagPages,
    ...kbCategoryPages,
    ...kbTopicPages,
    ...kbArticlePages,
    ...projectPages,
    ...architecturePages,
  ];
}

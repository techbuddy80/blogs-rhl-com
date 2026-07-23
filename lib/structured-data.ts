const BASE_URL = "https://blogs.rhl.com";
const SITE_NAME = "blogs.rhl.com";

interface BlogPostingInput {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  tags: string[];
}

export function buildBlogPostingSchema(post: BlogPostingInput) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: `${BASE_URL}${post.url}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: SITE_NAME },
    keywords: post.tags.join(", "),
  };
}

interface TechArticleInput {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  updatedAt?: string;
}

export function buildTechArticleSchema(doc: TechArticleInput) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: doc.title,
    description: doc.description,
    url: `${BASE_URL}${doc.url}`,
    datePublished: doc.publishedAt,
    dateModified: doc.updatedAt ?? doc.publishedAt,
    publisher: { "@type": "Organization", name: SITE_NAME },
  };
}

interface CreativeWorkInput {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  updatedAt?: string;
  keywords: string[];
}

export function buildCreativeWorkSchema(project: CreativeWorkInput) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: `${BASE_URL}${project.url}`,
    dateCreated: project.publishedAt,
    dateModified: project.updatedAt ?? project.publishedAt,
    keywords: project.keywords.join(", "),
    creator: { "@type": "Person", name: "Author" },
  };
}

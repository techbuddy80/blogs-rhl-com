import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Mdx } from "@/components/content/mdx-content";
import { JsonLd } from "@/components/seo/json-ld";
import { buildTechArticleSchema } from "@/lib/structured-data";
import {
  getPublishedArchitecture,
  resolveRelatedKbArticles,
  resolveRelatedProjects,
} from "@/lib/architecture";

export async function generateStaticParams() {
  return getPublishedArchitecture().map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getPublishedArchitecture().find((d) => d.slug === slug);
  if (!doc) return {};
  const url = `/architecture/${doc.slug}`;
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: url },
    openGraph: { title: doc.title, description: doc.description, type: "article", url },
    twitter: { card: "summary", title: doc.title, description: doc.description },
  };
}

export default async function ArchitectureDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getPublishedArchitecture().find((d) => d.slug === slug);

  if (!doc) notFound();

  const relatedProjects = resolveRelatedProjects(doc.relatedProjects);
  const relatedKbArticles = resolveRelatedKbArticles(doc.relatedKbArticles);

  return (
    <div className="container max-w-3xl py-12">
      <JsonLd
        data={buildTechArticleSchema({
          title: doc.title,
          description: doc.description,
          url: `/architecture/${doc.slug}`,
          publishedAt: doc.publishedAt,
          updatedAt: doc.updatedAt,
        })}
      />
      <Breadcrumb
        items={[
          { label: "Architecture", href: "/architecture" },
          { label: doc.domain, href: `/architecture?domain=${doc.domain}` },
          { label: doc.title },
        ]}
      />

      <h1 className="mb-2 mt-6 font-display text-3xl font-medium tracking-tight">
        {doc.title}
      </h1>
      <p className="text-muted-foreground">{doc.description}</p>

      <div className="prose prose-invert mt-8 max-w-none">
        <Mdx code={doc.mdx} />
      </div>

      {(relatedProjects.length > 0 || relatedKbArticles.length > 0) && (
        <div className="mt-8 grid grid-cols-1 gap-6 border-t border-border pt-6 sm:grid-cols-2">
          {relatedProjects.length > 0 && (
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                Related projects
              </p>
              <ul className="mt-2 space-y-1">
                {relatedProjects.map((p) => (
                  <li key={p.href}>
                    <Link href={p.href} className="text-sm text-primary hover:underline">
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {relatedKbArticles.length > 0 && (
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                Related knowledge base articles
              </p>
              <ul className="mt-2 space-y-1">
                {relatedKbArticles.map((a) => (
                  <li key={a.href}>
                    <Link href={a.href} className="text-sm text-primary hover:underline">
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

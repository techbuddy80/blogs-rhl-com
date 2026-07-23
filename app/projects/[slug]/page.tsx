import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Github, ExternalLink } from "lucide-react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Mdx } from "@/components/content/mdx-content";
import { TechnologyBadge } from "@/components/content/technology-badge";
import { StatusDot } from "@/components/content/status-dot";
import { ImageGallery } from "@/components/content/image-gallery";
import { Tag } from "@/components/content/tag";
import { JsonLd } from "@/components/seo/json-ld";
import { buildCreativeWorkSchema } from "@/lib/structured-data";
import { buttonVariants } from "@/components/ui/button";
import { getPublishedProjects } from "@/lib/projects";

export async function generateStaticParams() {
  return getPublishedProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getPublishedProjects().find((p) => p.slug === slug);
  if (!project) return {};
  const url = `/projects/${project.slug}`;
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: url },
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getPublishedProjects().find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <div className="container max-w-3xl py-12">
      <JsonLd
        data={buildCreativeWorkSchema({
          title: project.title,
          description: project.description,
          url: `/projects/${project.slug}`,
          publishedAt: project.publishedAt,
          updatedAt: project.updatedAt,
          keywords: [...project.tags, ...project.stack],
        })}
      />
      <Breadcrumb
        items={[{ label: "Projects", href: "/projects" }, { label: project.title }]}
      />

      <div className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-medium tracking-tight">
            {project.title}
          </h1>
          <StatusDot status={project.status} />
        </div>
        <p className="mt-3 text-muted-foreground">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <TechnologyBadge key={tech} name={tech} />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "outline" })}
            >
              <Github className="h-4 w-4" /> Repository
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "outline" })}
            >
              <ExternalLink className="h-4 w-4" /> Live Demo
            </a>
          )}
        </div>
      </div>

      {project.architectureDiagram && (
        <div className="my-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.architectureDiagram}
            alt={`${project.title} architecture diagram`}
            className="rounded-lg border border-border"
          />
        </div>
      )}

      <ImageGallery
        images={project.screenshots.map((src) => ({
          src,
          alt: `${project.title} screenshot`,
        }))}
      />

      {/* Author writes Overview / Lessons Learned / Future Improvements as
          regular MDX headings in the body — these are editorial sections,
          not separate frontmatter fields (see docs/08-projects-architecture.md). */}
      <div className="prose prose-invert mt-8 max-w-none">
        <Mdx code={project.mdx} />
      </div>

      <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-6">
        {project.tags.map((tag) => (
          <Tag key={tag} tag={tag} />
        ))}
      </div>
    </div>
  );
}

import { ProjectFilterBar } from "@/components/content/project-filter-bar";
import { ProjectCard } from "@/components/content/project-card";
import {
  filterProjectsByStatus,
  getPublishedProjects,
  type ProjectStatusFilter,
} from "@/lib/projects";

export default async function ProjectsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const projects = filterProjectsByStatus(
    getPublishedProjects(),
    status as ProjectStatusFilter
  );

  return (
    <div className="container space-y-8 py-12">
      <div>
        <h1 className="font-display text-3xl font-medium tracking-tight">Projects</h1>
        <p className="mt-2 text-muted-foreground">
          Infrastructure built and operated end-to-end — architecture, lessons learned,
          and what&rsquo;s next.
        </p>
      </div>

      <ProjectFilterBar basePath="/projects" activeStatus={status} />

      {projects.length === 0 ? (
        <p className="text-muted-foreground">No projects match that filter yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

import { allProjects, type Project } from "content-collections";

export type ProjectStatusFilter = Project["status"] | undefined;

export function getPublishedProjects(): Project[] {
  return allProjects
    .filter((p) => !p.draft)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function filterProjectsByStatus(
  projects: Project[],
  status: ProjectStatusFilter
): Project[] {
  if (!status) return projects;
  return projects.filter((p) => p.status === status);
}

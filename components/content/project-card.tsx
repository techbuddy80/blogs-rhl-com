import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { TechnologyBadge } from "@/components/content/technology-badge";
import { StatusDot, type ProjectStatus } from "@/components/content/status-dot";

export interface ProjectCardData {
  slug: string;
  title: string;
  description: string;
  status: ProjectStatus;
  stack: string[];
}

export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <Link href={`/projects/${project.slug}`} className="block h-full">
      <Card className="flex h-full flex-col justify-between">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{project.title}</CardTitle>
            <StatusDot status={project.status} />
          </div>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <TechnologyBadge key={tech} name={tech} />
          ))}
        </CardFooter>
      </Card>
    </Link>
  );
}

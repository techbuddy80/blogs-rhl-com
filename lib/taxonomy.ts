/**
 * Single source of truth for site-wide categories.
 *
 * Categories are deliberately few and curated (see architecture doc,
 * Step 1, section 6) — specifics that a merged category loses live as
 * free-form tags on individual content items instead of as new categories.
 *
 * Adding a category here is a real taxonomy decision, not a per-post choice.
 * Content frontmatter is validated against this list at build time via the
 * Content Collections schema in `lib/content-config.ts`.
 */

export interface Category {
  slug: string;
  label: string;
  description: string;
}

export const categories = [
  {
    slug: "oracle",
    label: "Oracle",
    description:
      "Oracle Database, RAC, Data Guard, Exadata, Oracle AI Database, Oracle Cloud, Oracle@AWS.",
  },
  {
    slug: "postgresql",
    label: "PostgreSQL",
    description: "PostgreSQL, EDB, AlloyDB.",
  },
  {
    slug: "databases",
    label: "Databases",
    description:
      "Cross-engine architecture, performance tuning, HA/DR, backup & recovery, migration.",
  },
  {
    slug: "cloud",
    label: "Cloud",
    description: "AWS, OCI, Azure.",
  },
  {
    slug: "infrastructure-networking",
    label: "Infrastructure & Networking",
    description:
      "Networking, DNS, reverse proxies, Cloudflare, virtualization, storage, SAN, NAS.",
  },
  {
    slug: "devops-automation",
    label: "DevOps & Automation",
    description: "Terraform, Ansible, GitHub Actions, Jenkins, CI/CD, Python.",
  },
  {
    slug: "containers-kubernetes",
    label: "Containers & Kubernetes",
    description: "Docker, Podman, Kubernetes, Helm, GitOps.",
  },
  {
    slug: "homelab",
    label: "Homelab",
    description: "Proxmox, LXC, VMs, TrueNAS, Grafana, Prometheus.",
  },
  {
    slug: "linux",
    label: "Linux",
    description: "Linux administration, tuning, and internals.",
  },
  {
    slug: "security",
    label: "Security",
    description: "Hardening, secrets management, security architecture.",
  },
  {
    slug: "ai",
    label: "AI",
    description: "Vector search, LLMs, Ollama, MCP servers, RAG, AI automation.",
  },
  {
    slug: "career",
    label: "Career",
    description: "Professional growth, reflections, engineering philosophy.",
  },
] as const satisfies readonly Category[];

export type CategorySlug = (typeof categories)[number]["slug"];

export function isValidCategory(slug: string): slug is CategorySlug {
  return categories.some((c) => c.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

// Full hero (CTA buttons, recent articles, featured projects, tech stack,
// timeline, newsletter) is a separate homepage build — out of scope for
// this content update, which only replaces the placeholder subtitle text
// and adds the headshot.

export default function HomePage() {
  return (
    <div className="container py-24">
      <div className="flex flex-col-reverse items-start gap-8 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-4xl font-medium tracking-tight">
            Senior Database Architect • Cloud Engineer • Infrastructure Enthusiast
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Senior Database Architect and Oracle DBA specializing in RAC, Data Guard,
            Exadata, and OCI — with a parallel life running a homelab full of Kubernetes
            clusters, Ansible playbooks, and self-hosted infrastructure. This site is
            where both halves show their work.
          </p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/headshot.jpg"
          alt="Ram Shankar"
          width={128}
          height={128}
          className="h-32 w-32 shrink-0 rounded-full border border-border object-cover sm:h-36 sm:w-36"
        />
      </div>
    </div>
  );
}

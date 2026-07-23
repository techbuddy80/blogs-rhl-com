// Full hero, featured content, and homepage sections are built in later
// steps once the design system (Step 3) and content pipelines (Steps 6–9)
// exist to pull real data from. This stub confirms routing + layout work.

export default function HomePage() {
  return (
    <div className="container py-24">
      <h1 className="text-4xl font-bold tracking-tight">
        Senior Database Architect • Cloud Engineer • Infrastructure Enthusiast
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        I design, automate, and operate enterprise database platforms while exploring
        cloud infrastructure, virtualization, networking, Kubernetes, Linux, automation,
        AI, and modern self-hosted technologies.
      </p>
    </div>
  );
}

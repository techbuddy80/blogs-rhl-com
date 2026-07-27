// Career timeline, skills, certifications, tech stack, and resume download
// (per the original spec's About page sections) are a separate build —
// this update only adds the professional bio, replacing the empty stub.

export default function AboutPage() {
  return (
    <div className="container max-w-2xl py-24">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/headshot.jpg"
          alt="Ram Shankar"
          width={112}
          height={112}
          className="h-28 w-28 shrink-0 rounded-lg border border-border object-cover"
        />
        <h1 className="font-display text-3xl font-medium tracking-tight">About</h1>
      </div>
      <div className="prose prose-invert mt-8 max-w-none">
        <p>
          Senior Database Architect and Oracle DBA specializing in RAC, Data Guard,
          Exadata, and Oracle Cloud Infrastructure — the kind of database work where a
          misconfigured interconnect or a botched <code>RESETLOGS</code> can turn into a
          very long night. That experience shaped how I think about infrastructure
          generally: test it before it&rsquo;s load-bearing, automate the boring parts,
          and write down the bugs you actually hit so you don&rsquo;t repeat them.
        </p>
        <p>
          Outside of production environments, I run a homelab — Proxmox, Kubernetes,
          Terraform, Ansible, a Jenkins pipeline or two — where I try out the same
          patterns I use professionally before they&rsquo;re anywhere near something that
          matters. This site is where the two intersect: real Oracle, PostgreSQL, and
          cloud engineering write-ups, alongside the homelab experiments, automation
          projects, and the bugs I hit building both.
        </p>
      </div>
    </div>
  );
}

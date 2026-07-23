import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { DomainFilterBar } from "@/components/content/domain-filter-bar";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  filterArchitectureByDomain,
  getArchitectureDomains,
  getPublishedArchitecture,
} from "@/lib/architecture";

export default async function ArchitectureIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string }>;
}) {
  const { domain } = await searchParams;
  const docs = filterArchitectureByDomain(getPublishedArchitecture(), domain);
  const domains = getArchitectureDomains();

  return (
    <div className="container space-y-8 py-12">
      <Breadcrumb items={[{ label: "Architecture" }]} />
      <div>
        <h1 className="font-display text-3xl font-medium tracking-tight">Architecture</h1>
        <p className="mt-2 text-muted-foreground">
          Reference diagrams and rationale, grouped by domain.
        </p>
      </div>

      <DomainFilterBar domains={domains} activeDomain={domain} />

      {docs.length === 0 ? (
        <p className="text-muted-foreground">No reference diagrams in this domain yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc) => (
            <Link key={doc.slug} href={`/architecture/${doc.slug}`}>
              <Card className="h-full">
                <CardHeader>
                  <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    {doc.domain}
                  </p>
                  <CardTitle className="mt-1">{doc.title}</CardTitle>
                  <CardDescription>{doc.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

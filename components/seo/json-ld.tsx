// Renders a JSON-LD <script> tag. Next's Metadata API has no first-class
// slot for structured data, so this is added directly in each detail
// page's JSX rather than through generateMetadata.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

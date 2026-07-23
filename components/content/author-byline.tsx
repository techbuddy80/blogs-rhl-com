export function AuthorByline({
  author,
  publishedAt,
  updatedAt,
  readingTime,
}: {
  author: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
}) {
  const published = new Date(publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-sm text-muted-foreground">
      <span className="text-foreground">{author}</span>
      <span aria-hidden>·</span>
      <span>{published}</span>
      {updatedAt && (
        <>
          <span aria-hidden>·</span>
          <span>
            updated{" "}
            {new Date(updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </>
      )}
      <span aria-hidden>·</span>
      <span>{readingTime} min read</span>
    </div>
  );
}

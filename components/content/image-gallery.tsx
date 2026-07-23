export interface GalleryImage {
  src: string;
  alt: string;
}

// Plain <img>, not next/image — same trade-off documented for MDX images
// in Step 5 (content-authored paths without known build-time dimensions).
export function ImageGallery({ images }: { images: GalleryImage[] }) {
  if (images.length === 0) return null;

  return (
    <div className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {images.map((image) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={image.src}
          src={image.src}
          alt={image.alt}
          loading="lazy"
          className="rounded-lg border border-border"
        />
      ))}
    </div>
  );
}

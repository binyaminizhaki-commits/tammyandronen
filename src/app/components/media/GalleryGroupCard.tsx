import { useState } from "react";

import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";
import type { ImageGroup } from "../../data/siteImages";
import { ImageLightboxDialog, type GalleryLabels } from "./ImageLightboxDialog";

interface GalleryGroupCardProps {
  group: ImageGroup;
  labels: GalleryLabels;
  className?: string;
  title?: string;
  description?: string;
  metadata?: string[];
}

export function GalleryGroupCard({
  group,
  labels,
  className,
  title,
  description,
  metadata,
}: GalleryGroupCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const coverAsset = group.featuredAsset;
  const cardTitle = title ?? group.titleHe;
  const cardDescription = description ?? coverAsset.captionHe;

  return (
    <>
      <article
        className={cn(
          "overflow-hidden rounded-[2rem] border border-black/8 bg-white/78 shadow-lg shadow-stone-200/25 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-2xl",
          className,
        )}
      >
        <button type="button" className="block w-full text-left" onClick={() => setIsOpen(true)}>
          <div className="relative overflow-hidden">
            <ImageWithFallback
              src={coverAsset.src}
              alt={coverAsset.altHe}
              className="aspect-[4/5] w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-4">
              <span className="rounded-full bg-white/88 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur">
                {group.imageCount} {labels.images}
              </span>
              <span className="rounded-full bg-accent/90 px-3 py-1 text-xs font-medium text-white shadow-sm">
                {labels.openGallery}
              </span>
            </div>
          </div>
        </button>

        <div className="space-y-3 px-5 py-5">
          <div className="space-y-1">
            <h3 className="text-2xl font-light text-foreground">{cardTitle}</h3>
            {cardDescription ? (
              <p className="line-clamp-3 text-sm leading-relaxed text-secondary">{cardDescription}</p>
            ) : null}
          </div>

          {metadata?.length ? (
            <div className="flex flex-wrap gap-2">
              {metadata.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-black/8 bg-stone-100/80 px-3 py-1 text-xs text-secondary"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : null}
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-secondary/70">
              {group.imageCount} {labels.images}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="rounded-full border-accent/35 bg-white/85 px-5 text-accent hover:border-accent hover:bg-accent/8"
            onClick={() => setIsOpen(true)}
          >
            {labels.openGallery}
          </Button>
        </div>
      </article>

      <ImageLightboxDialog
        assets={group.assets}
        title={cardTitle}
        labels={labels}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
}

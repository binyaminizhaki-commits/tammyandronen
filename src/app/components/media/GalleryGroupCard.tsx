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
  buttonLabel?: string;
}

export function GalleryGroupCard({
  group,
  labels,
  className,
  title,
  buttonLabel = "גלריה",
}: GalleryGroupCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const coverAsset = group.featuredAsset;
  const cardTitle = title ?? group.titleHe;

  return (
    <>
      <article
        className={cn(
          "overflow-hidden border border-black/8 bg-white/78 shadow-sm transition-colors duration-200 hover:border-accent/40",
          className,
        )}
      >
        <button type="button" className="block w-full text-left" onClick={() => setIsOpen(true)}>
          <div className="overflow-hidden">
            <ImageWithFallback
              src={coverAsset.src}
              alt={coverAsset.altHe}
              className="aspect-[4/5] w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </button>

        <div className="space-y-4 px-4 py-4">
          <h3 className="text-xl font-light text-foreground">{cardTitle}</h3>

          <Button
            type="button"
            variant="outline"
            className="rounded-md border-black/12 bg-transparent px-4 text-accent hover:border-accent hover:bg-transparent hover:text-accent"
            onClick={() => setIsOpen(true)}
          >
            {buttonLabel}
          </Button>
        </div>
      </article>

      <ImageLightboxDialog
        assets={group.assets}
        title={cardTitle}
        labels={labels}
        showDescription={false}
        showThumbnailCaptions={false}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
}

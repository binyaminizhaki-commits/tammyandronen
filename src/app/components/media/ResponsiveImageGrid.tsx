import { useState } from "react";

import { ImageWithFallback } from "../figma/ImageWithFallback";
import { cn } from "../ui/utils";
import type { SiteImageAsset } from "../../data/siteImages";
import { ImageLightboxDialog, type GalleryLabels } from "./ImageLightboxDialog";

interface ResponsiveImageGridProps {
  assets: SiteImageAsset[];
  dialogTitle: string;
  labels: GalleryLabels;
  className?: string;
  interactive?: boolean;
  emphasizeFirst?: boolean;
  showCaptions?: boolean;
  lightboxShowDescription?: boolean;
  lightboxShowThumbnailCaptions?: boolean;
}

export function ResponsiveImageGrid({
  assets,
  dialogTitle,
  labels,
  className,
  interactive = true,
  emphasizeFirst = false,
  showCaptions = true,
  lightboxShowDescription = true,
  lightboxShowThumbnailCaptions = true,
}: ResponsiveImageGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!assets.length) {
    return null;
  }

  const gridColumnsClassName =
    assets.length === 1 ? "grid-cols-1" : assets.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3";

  return (
    <>
      <div className={cn("grid gap-4", gridColumnsClassName, className)}>
        {assets.map((asset, index) => {
          const shouldEmphasize = emphasizeFirst && index === 0 && assets.length >= 3;
          const Tile = interactive ? "button" : "div";

          return (
            <Tile
              key={asset.id}
              {...(interactive ? { type: "button", onClick: () => setActiveIndex(index) } : {})}
              className={cn(
                "group relative overflow-hidden rounded-[2rem] border border-black/8 bg-white/75 text-left shadow-lg shadow-stone-200/20 transition-all duration-300",
                interactive ? "cursor-pointer hover:-translate-y-1 hover:border-accent/45 hover:shadow-2xl" : "",
                shouldEmphasize ? "md:col-span-2" : "",
              )}
            >
              <ImageWithFallback
                src={asset.src}
                alt={asset.altHe}
                className={cn(
                  "w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]",
                  shouldEmphasize ? "aspect-[16/10]" : "aspect-[4/3]",
                )}
                loading="lazy"
                decoding="async"
              />

              {showCaptions ? (
                <div className="space-y-1 border-t border-black/6 bg-white/88 px-4 py-4 backdrop-blur">
                  <p className="text-sm font-medium text-foreground">{asset.captionHe}</p>
                  <p className="text-xs text-secondary">{asset.titleHe}</p>
                </div>
              ) : null}
            </Tile>
          );
        })}
      </div>

      {interactive && activeIndex !== null ? (
        <ImageLightboxDialog
          assets={assets}
          title={dialogTitle}
          labels={labels}
          showDescription={lightboxShowDescription}
          showThumbnailCaptions={lightboxShowThumbnailCaptions}
          open={activeIndex !== null}
          initialIndex={activeIndex}
          onOpenChange={(open) => {
            if (!open) {
              setActiveIndex(null);
            }
          }}
        />
      ) : null}
    </>
  );
}

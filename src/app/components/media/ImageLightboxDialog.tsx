import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { cn } from "../ui/utils";
import type { SiteImageAsset } from "../../data/siteImages";

export interface GalleryLabels {
  openGallery: string;
  images: string;
  previousImage: string;
  nextImage: string;
}

interface ImageLightboxDialogProps {
  assets: SiteImageAsset[];
  title: string;
  labels: GalleryLabels;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialIndex?: number;
  showDescription?: boolean;
  showThumbnailCaptions?: boolean;
}

export function ImageLightboxDialog({
  assets,
  title,
  labels,
  open,
  onOpenChange,
  initialIndex = 0,
  showDescription = true,
  showThumbnailCaptions = true,
}: ImageLightboxDialogProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const activeAsset = assets[activeIndex];

  useEffect(() => {
    if (open) {
      setActiveIndex(initialIndex);
    }
  }, [initialIndex, open]);

  useEffect(() => {
    if (!open || assets.length <= 1) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((currentIndex) => (currentIndex - 1 + assets.length) % assets.length);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((currentIndex) => (currentIndex + 1) % assets.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [assets.length, open]);

  if (!activeAsset) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(94vh,56rem)] gap-0 overflow-hidden border-amber-200/60 bg-[rgba(250,247,241,0.97)] p-0 shadow-2xl sm:max-w-6xl">
        <DialogHeader className="shrink-0 border-b border-black/8 px-6 py-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1 text-left">
              <DialogTitle className="text-2xl font-light text-foreground">{title}</DialogTitle>
              {showDescription ? (
                <DialogDescription className="text-base text-secondary">
                  {activeAsset.captionHe}
                </DialogDescription>
              ) : null}
            </div>
            <p className="text-sm text-secondary">
              {activeIndex + 1} / {assets.length}
            </p>
          </div>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
          <div className="relative flex min-h-[18rem] items-center justify-center overflow-hidden rounded-[2rem] border border-black/8 bg-white/70 px-4 py-4 shadow-xl sm:min-h-[24rem] sm:px-6 sm:py-6">
            <ImageWithFallback
              key={activeAsset.id}
              src={activeAsset.src}
              alt={activeAsset.altHe}
              className="block max-h-[min(62vh,38rem)] w-auto max-w-full object-contain bg-[radial-gradient(circle_at_top,rgba(200,169,106,0.08),transparent_45%)]"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />

            {assets.length > 1 ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={labels.previousImage}
                  onClick={() =>
                    setActiveIndex((currentIndex) => (currentIndex - 1 + assets.length) % assets.length)
                  }
                  className="absolute left-2 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full border-white/70 bg-white/85 shadow-lg backdrop-blur sm:left-4"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={labels.nextImage}
                  onClick={() => setActiveIndex((currentIndex) => (currentIndex + 1) % assets.length)}
                  className="absolute right-2 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full border-white/70 bg-white/85 shadow-lg backdrop-blur sm:right-4"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            ) : null}
          </div>

          {assets.length > 1 ? (
            <div className="shrink-0 overflow-x-auto pb-1">
              <div className="flex gap-3">
                {assets.map((asset, index) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "group min-w-[7rem] max-w-[7rem] overflow-hidden rounded-2xl border bg-white/80 shadow-sm transition-all duration-300",
                      index === activeIndex
                        ? "border-accent shadow-lg shadow-amber-200/40"
                        : "border-black/8 hover:border-accent/40",
                    )}
                  >
                    <ImageWithFallback
                      src={asset.src}
                      alt={asset.altHe}
                      className="aspect-[4/3] w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    {showThumbnailCaptions ? (
                      <span className="line-clamp-2 block px-2 py-2 text-xs text-secondary">
                        {asset.captionHe}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

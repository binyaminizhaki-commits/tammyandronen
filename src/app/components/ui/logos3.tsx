"use client";

import * as React from "react";
import AutoScroll from "embla-carousel-auto-scroll";

import { cn } from "@/lib/utils";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "./carousel";

export interface Logo {
  id: string;
  description: string;
  image: string;
  className?: string;
}

interface Logos3Props {
  heading?: string;
  logos?: Logo[];
  className?: string;
}

const defaultLogos: Logo[] = [
  {
    id: "logo-1",
    description: "Astro",
    image: "https://www.shadcnblocks.com/images/block/logos/astro.svg",
    className: "h-7 w-auto",
  },
  {
    id: "logo-2",
    description: "Figma",
    image: "https://www.shadcnblocks.com/images/block/logos/figma.svg",
    className: "h-7 w-auto",
  },
  {
    id: "logo-3",
    description: "Next.js",
    image: "https://www.shadcnblocks.com/images/block/logos/nextjs.svg",
    className: "h-7 w-auto",
  },
  {
    id: "logo-4",
    description: "React",
    image: "https://www.shadcnblocks.com/images/block/logos/react.png",
    className: "h-7 w-auto",
  },
  {
    id: "logo-5",
    description: "shadcn/ui",
    image: "https://www.shadcnblocks.com/images/block/logos/shadcn-ui.svg",
    className: "h-7 w-auto",
  },
  {
    id: "logo-6",
    description: "Supabase",
    image: "https://www.shadcnblocks.com/images/block/logos/supabase.svg",
    className: "h-7 w-auto",
  },
  {
    id: "logo-7",
    description: "Tailwind CSS",
    image: "https://www.shadcnblocks.com/images/block/logos/tailwind.svg",
    className: "h-4 w-auto",
  },
  {
    id: "logo-8",
    description: "Vercel",
    image: "https://www.shadcnblocks.com/images/block/logos/vercel.svg",
    className: "h-7 w-auto",
  },
];

function Logos3({
  heading = "Trusted by these companies",
  logos = defaultLogos,
  className,
}: Logos3Props) {
  const plugin = React.useRef(
    AutoScroll({
      playOnInit: true,
      startDelay: 0,
      direction: "backward",
      speed: 0.65,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
    }),
  );

  return (
    <section className={cn("w-full", className)}>
      <div className="mb-6 flex flex-col items-center text-center">
        <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-secondary/75">
          {heading}
        </h2>
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-amber-300/40 bg-gradient-to-br from-amber-50/85 via-white/85 to-stone-100/80 shadow-[0_24px_80px_rgba(120,100,58,0.12)] backdrop-blur-xl">
        <Carousel
          opts={{ loop: true, align: "start", dragFree: true }}
          plugins={[plugin.current]}
          className="w-full"
        >
          <CarouselContent className="ml-0 items-center">
            {logos.map((logo) => (
              <CarouselItem
                key={logo.id}
                className="basis-[44%] pl-0 sm:basis-[34%] md:basis-[26%] lg:basis-[20%] xl:basis-[16.666%]"
              >
                <div className="flex min-h-[104px] items-center justify-center px-6 py-5">
                  <img
                    src={logo.image}
                    alt={logo.description}
                    loading="lazy"
                    draggable={false}
                    className={cn(
                      "h-[52px] w-auto max-w-[180px] object-contain opacity-80 transition duration-300 ease-out hover:scale-[1.03] hover:opacity-100 sm:h-[60px]",
                      logo.className,
                    )}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-[rgba(247,243,236,0.98)] to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-[rgba(247,243,236,0.98)] to-transparent sm:w-24" />
      </div>
    </section>
  );
}

export { Logos3 };

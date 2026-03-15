"use client";

import { cn } from "@/lib/utils";

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
  variant?: "framed" | "bare";
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
  variant = "framed",
}: Logos3Props) {
  return (
    <section className={cn("w-full", className)}>
      <div className="mb-5 flex flex-col items-center text-center">
        <h2 className="text-sm font-medium text-secondary/78">{heading}</h2>
      </div>

      <div
        className={cn(
          "relative overflow-hidden",
          variant === "framed"
            ? "rounded-[2rem] border border-amber-300/40 bg-gradient-to-br from-amber-50/85 via-white/85 to-stone-100/80 shadow-[0_24px_80px_rgba(120,100,58,0.12)] backdrop-blur-xl"
            : "",
        )}
      >
        <ul
          className={cn(
            "grid items-center",
            variant === "framed"
              ? "grid-cols-2 gap-x-4 gap-y-3 px-4 py-4 sm:grid-cols-3 sm:px-6 sm:py-5 lg:grid-cols-6"
              : "grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3 lg:grid-cols-6",
          )}
        >
          {logos.map((logo) => (
            <li key={logo.id} className="min-w-0">
              <div
                className={cn(
                  "flex items-center justify-center px-2",
                  variant === "framed" ? "min-h-[86px] py-3 sm:min-h-[96px]" : "min-h-[72px] py-2",
                )}
              >
                <img
                  src={logo.image}
                  alt={logo.description}
                  loading="lazy"
                  draggable={false}
                  className={cn(
                    "h-[46px] w-auto max-w-full object-contain opacity-88 sm:h-[54px]",
                    logo.className,
                  )}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export { Logos3 };

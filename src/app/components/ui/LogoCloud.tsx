import { InfiniteSlider } from "./InfiniteSlider";
import { cn } from "@/lib/utils";

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type LogoCloudProps = React.ComponentProps<"div"> & {
  logos: Logo[];
};

export function LogoCloud({ className, logos, ...props }: LogoCloudProps) {
  return (
    <div
      {...props}
      className={cn(
        "overflow-hidden py-6 [mask-image:linear-gradient(to_right,transparent_0,black_7%,black_93%,transparent_100%)]",
        className
      )}
    >
      <InfiniteSlider gap={56} reverse speed={42} speedOnHover={28}>
        {logos.map((logo) => (
          <img
            alt={logo.alt}
            className="pointer-events-none h-16 w-auto shrink-0 select-none object-contain opacity-90 transition-opacity duration-300 md:h-20 lg:h-24"
            height={logo.height || "auto"}
            key={`logo-${logo.alt}`}
            loading="lazy"
            src={logo.src}
            width={logo.width || "auto"}
          />
        ))}
      </InfiniteSlider>
    </div>
  );
}

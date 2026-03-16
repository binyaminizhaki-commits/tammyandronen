import { cn } from "@/lib/utils";

type PageHeroTitleProps = {
  title: string;
  subtitle?: string;
  compact?: boolean;
  className?: string;
};

export function PageHeroTitle({ title, subtitle, compact = false, className }: PageHeroTitleProps) {
  return (
    <section
      className={cn(
        "mx-auto max-w-5xl space-y-4 text-center",
        compact ? "py-4 md:py-6" : "py-2 md:py-4",
        className,
      )}
    >
      <h1 className={cn("text-balance tracking-tighter text-foreground", compact ? "text-4xl md:text-5xl lg:text-6xl" : "text-5xl md:text-6xl lg:text-7xl")}>
        {title}
      </h1>
      {subtitle ? (
        <p className={cn("mx-auto max-w-3xl text-balance leading-relaxed text-secondary", compact ? "text-base md:text-lg" : "text-lg md:text-xl")}>
          {subtitle}
        </p>
      ) : null}
    </section>
  );
}

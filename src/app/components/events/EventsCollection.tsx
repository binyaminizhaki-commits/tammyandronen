import { motion } from "motion/react";
import { AlertCircle, CalendarRange } from "lucide-react";
import type { EventItem } from "../../events/types";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTranslation } from "../../translations/useTranslation";
import { cn } from "../../../lib/utils";
import { EventCard } from "./EventCard";

type EventsCollectionProps = {
  title: string;
  description: string;
  events: EventItem[];
  loading: boolean;
  error: string | null;
  emptyTitle: string;
  emptyDescription: string;
};

const copy = {
  he: {
    unavailableTitle: "לא ניתן לטעון את האירועים כרגע",
    unavailableDescription:
      "האתר נשאר זמין, אבל חיבור ה-Notion לא החזיר נתונים. נסו שוב בעוד כמה דקות.",
  },
  en: {
    unavailableTitle: "Events are temporarily unavailable",
    unavailableDescription:
      "The site is still online, but the Notion events feed could not be reached. Please try again shortly.",
  },
} as const;

export function EventsCollection({
  title,
  description,
  events,
  loading,
  error,
  emptyTitle,
  emptyDescription,
}: EventsCollectionProps) {
  const { isRTL } = useLanguage();
  const { language } = useTranslation();
  const labels = copy[language];

  return (
    <section className="space-y-8">
      <div className={cn("space-y-3", isRTL ? "text-right" : "text-left")}>
        <h2 className="text-4xl md:text-5xl font-light text-foreground">{title}</h2>
        <p className="max-w-3xl text-lg leading-relaxed text-secondary">{description}</p>
      </div>

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[2rem] border border-black/6 bg-white/45 shadow-xl shadow-stone-200/15"
            >
              <div className="aspect-[16/11] animate-pulse bg-stone-200/70" />
              <div className="space-y-4 p-6">
                <div className="h-4 w-24 animate-pulse rounded-full bg-stone-200/70" />
                <div className="h-8 w-3/4 animate-pulse rounded-full bg-stone-200/70" />
                <div className="space-y-2">
                  <div className="h-4 w-2/3 animate-pulse rounded-full bg-stone-200/70" />
                  <div className="h-4 w-1/2 animate-pulse rounded-full bg-stone-200/70" />
                </div>
                <div className="h-20 animate-pulse rounded-[1.5rem] bg-stone-200/60" />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {!loading && error ? (
        <div
          className={cn(
            "flex items-start gap-3 rounded-[1.75rem] border border-amber-200/80 bg-white/75 p-5 text-secondary shadow-lg shadow-stone-200/15 backdrop-blur-xl",
            isRTL ? "flex-row-reverse text-right" : "",
          )}
        >
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
          <div className="space-y-1">
            <p className="font-medium text-foreground">{labels.unavailableTitle}</p>
            <p className="text-sm leading-relaxed">{labels.unavailableDescription}</p>
          </div>
        </div>
      ) : null}

      {!loading && !error && events.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "rounded-[2rem] border border-dashed border-black/10 bg-white/55 p-10 shadow-xl shadow-stone-200/15 backdrop-blur-xl",
            isRTL ? "text-right" : "text-left",
          )}
        >
          <div className="mb-5 inline-flex rounded-full bg-accent/10 p-3 text-accent">
            <CalendarRange className="h-6 w-6" />
          </div>
          <h3 className="mb-3 text-3xl font-light text-foreground">{emptyTitle}</h3>
          <p className="max-w-2xl text-base leading-relaxed text-secondary">{emptyDescription}</p>
        </motion.div>
      ) : null}

      {!loading && !error && events.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

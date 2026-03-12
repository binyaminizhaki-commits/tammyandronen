import { motion } from "motion/react";
import { CalendarDays, Clock3, MapPin, Ticket } from "lucide-react";
import type { EventItem } from "../../events/types";
import { formatEventDate, formatEventLocation } from "../../events/utils";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTranslation } from "../../translations/useTranslation";
import { cn } from "../../../lib/utils";
import { ImageWithFallback } from "../figma/ImageWithFallback";

type EventCardProps = {
  event: EventItem;
  compact?: boolean;
};

const copy = {
  he: {
    featured: "מומלץ",
    soldOut: "אזל מהמלאי",
    fallbackDescription: "פרטים נוספים על האירוע יתפרסמו בקרוב.",
    moreDetailsSoon: "פרטים מלאים בקרוב",
    ticketButton: "לכרטיסים",
  },
  en: {
    featured: "Featured",
    soldOut: "Sold out",
    fallbackDescription: "More event details will be added soon.",
    moreDetailsSoon: "More details soon",
    ticketButton: "Get tickets",
  },
} as const;

export function EventCard({ event, compact = false }: EventCardProps) {
  const { language } = useTranslation();
  const { isRTL } = useLanguage();
  const location = formatEventLocation(event);
  const formattedDate = formatEventDate(event.date, language);
  const showTicketsButton = !event.soldOut && Boolean(event.ticketsUrl);
  const labels = copy[language];

  return (
    <motion.article
      whileHover={{ y: -10, scale: 1.01 }}
      transition={{ duration: 0.35 }}
      className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-black/8 bg-white/60 shadow-xl shadow-stone-200/20 backdrop-blur-xl"
    >
      <div className="relative overflow-hidden border-b border-black/6 bg-stone-100/70">
        {event.imageUrl ? (
          <ImageWithFallback
            src={event.imageUrl}
            alt={event.title}
            className={cn(
              "w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]",
              compact ? "aspect-[4/3]" : "aspect-[16/11]",
            )}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            className={cn(
              "relative flex w-full items-end overflow-hidden bg-[linear-gradient(135deg,rgba(200,169,106,0.2)_0%,rgba(255,255,255,0.9)_55%,rgba(17,17,17,0.06)_100%)] p-6",
              compact ? "aspect-[4/3]" : "aspect-[16/11]",
            )}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,169,106,0.25),transparent_42%)]" />
            <div className="relative flex flex-col gap-2">
              {event.category ? (
                <span className="inline-flex w-fit rounded-full border border-accent/20 bg-white/85 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-accent">
                  {event.category}
                </span>
              ) : null}
              <span className="text-sm text-secondary">{formattedDate}</span>
            </div>
          </div>
        )}

        <div
          className={cn(
            "absolute top-4 flex flex-wrap gap-2",
            isRTL ? "left-4 justify-start" : "right-4 justify-end",
          )}
        >
          {event.featured ? (
            <span className="rounded-full border border-accent/25 bg-white/90 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-accent shadow-sm">
              {labels.featured}
            </span>
          ) : null}
          {event.soldOut ? (
            <span className="rounded-full bg-foreground px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white shadow-sm">
              {labels.soldOut}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex h-full flex-col gap-5 p-6">
        <div className="space-y-3">
          {event.category && event.imageUrl ? (
            <span className="inline-flex rounded-full border border-accent/20 bg-accent/8 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-accent">
              {event.category}
            </span>
          ) : null}

          <h3 className="text-2xl font-medium text-foreground">{event.title}</h3>

          <div className="space-y-2 text-sm text-secondary">
            <div
              className={cn("flex items-center gap-2", isRTL ? "flex-row-reverse justify-end" : "")}
            >
              <CalendarDays className="h-4 w-4 text-accent" />
              <span>{formattedDate}</span>
            </div>

            {event.time ? (
              <div
                className={cn("flex items-center gap-2", isRTL ? "flex-row-reverse justify-end" : "")}
              >
                <Clock3 className="h-4 w-4 text-accent" />
                <span>{event.time}</span>
              </div>
            ) : null}

            {location ? (
              <div
                className={cn("flex items-center gap-2", isRTL ? "flex-row-reverse justify-end" : "")}
              >
                <MapPin className="h-4 w-4 text-accent" />
                <span>{location}</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-5">
          <p className="line-clamp-4 text-base leading-relaxed text-secondary">
            {event.shortDescription ?? labels.fallbackDescription}
          </p>

          <div
            className={cn(
              "flex items-center gap-3",
              isRTL ? "flex-row-reverse justify-between" : "justify-between",
            )}
          >
            {showTicketsButton ? (
              <a
                href={event.ticketsUrl ?? undefined}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-white shadow-lg shadow-amber-200/40 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-200/50"
              >
                <Ticket className="h-4 w-4" />
                <span>{labels.ticketButton}</span>
              </a>
            ) : event.soldOut ? (
              <span className="inline-flex min-h-11 items-center rounded-full border border-black/10 bg-black/5 px-5 py-3 text-sm font-medium text-secondary">
                {labels.soldOut}
              </span>
            ) : (
              <span className="text-sm text-secondary">{labels.moreDetailsSoon}</span>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

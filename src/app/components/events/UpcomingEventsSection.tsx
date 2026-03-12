import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useEvents } from "../../events/useEvents";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTranslation } from "../../translations/useTranslation";
import { cn } from "../../../lib/utils";
import { EventCard } from "./EventCard";

const copy = {
  he: {
    kicker: "אירועים קרובים",
    title: "האירועים הבאים בארכיון",
    description:
      "תוכנית מתעדכנת של מפגשים, הופעות ואירועים פתוחים לקהל מתוך העשייה השוטפת של הארכיון.",
    viewAll: "לכל האירועים",
    unavailableTitle: "לא ניתן לטעון את האירועים כרגע",
    unavailableDescription:
      "האתר נשאר זמין, אבל חיבור ה-Notion לא החזיר נתונים. נסו שוב בעוד כמה דקות.",
    emptyTitle: "אין כרגע אירועים קרובים",
    emptyDescription:
      "כאשר יתווספו אירועים מסומנים כ-Published עם תאריך עתידי, הם יופיעו כאן אוטומטית.",
  },
  en: {
    kicker: "Upcoming events",
    title: "What’s happening next at the archive",
    description:
      "A living program of performances, gatherings, and public events, managed directly from Notion.",
    viewAll: "View all events",
    unavailableTitle: "Events are temporarily unavailable",
    unavailableDescription:
      "The site is still online, but the Notion events feed could not be reached. Please try again shortly.",
    emptyTitle: "No upcoming events right now",
    emptyDescription:
      "As soon as published future events are added in Notion, they will appear here automatically.",
  },
} as const;

export function UpcomingEventsSection() {
  const { language } = useTranslation();
  const { isRTL } = useLanguage();
  const { events, loading, error } = useEvents({ featured: true, limit: 3 });
  const labels = copy[language];

  return (
    <section className="relative overflow-hidden px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div
            className={cn(
              "flex flex-col gap-6 rounded-[2.5rem] border border-black/6 bg-white/45 p-8 shadow-2xl shadow-stone-200/20 backdrop-blur-xl md:flex-row md:items-end md:justify-between",
              isRTL ? "md:flex-row-reverse" : "",
            )}
          >
            <div className={cn("max-w-3xl space-y-4", isRTL ? "text-right" : "text-left")}>
              <span className="inline-flex rounded-full border border-accent/20 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                {labels.kicker}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
                {labels.title}
              </h2>
              <p className="text-lg leading-relaxed text-secondary">{labels.description}</p>
            </div>

            <Link
              to="/events"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/10 bg-white/80 px-5 py-3 text-sm font-medium text-foreground shadow-sm transition-all duration-300 hover:border-accent/30 hover:text-accent"
            >
              <span>{labels.viewAll}</span>
              <ArrowLeft className={cn("h-4 w-4", !isRTL && "rotate-180")} />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[2rem] border border-black/6 bg-white/45 shadow-xl shadow-stone-200/15"
                >
                  <div className="aspect-[4/3] animate-pulse bg-stone-200/70" />
                  <div className="space-y-4 p-6">
                    <div className="h-4 w-24 animate-pulse rounded-full bg-stone-200/70" />
                    <div className="h-8 w-3/4 animate-pulse rounded-full bg-stone-200/70" />
                    <div className="h-16 animate-pulse rounded-[1.5rem] bg-stone-200/60" />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {!loading && error ? (
            <div
              className={cn(
                "rounded-[2rem] border border-amber-200/70 bg-white/70 p-8 shadow-xl shadow-stone-200/15 backdrop-blur-xl",
                isRTL ? "text-right" : "text-left",
              )}
            >
              <h3 className="mb-2 text-2xl font-light text-foreground">{labels.unavailableTitle}</h3>
              <p className="max-w-2xl text-base leading-relaxed text-secondary">
                {labels.unavailableDescription}
              </p>
            </div>
          ) : null}

          {!loading && !error && events.length === 0 ? (
            <div
              className={cn(
                "rounded-[2rem] border border-dashed border-black/10 bg-white/55 p-8 shadow-xl shadow-stone-200/15 backdrop-blur-xl",
                isRTL ? "text-right" : "text-left",
              )}
            >
              <h3 className="mb-3 text-2xl font-light text-foreground">{labels.emptyTitle}</h3>
              <p className="max-w-2xl text-base leading-relaxed text-secondary">
                {labels.emptyDescription}
              </p>
            </div>
          ) : null}

          {!loading && !error && events.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} compact />
              ))}
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}

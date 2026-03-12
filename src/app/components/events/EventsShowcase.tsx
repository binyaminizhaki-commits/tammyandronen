import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowUpRight, CalendarDays, Clock3, MapPin, Ticket } from "lucide-react";
import type { EventItem } from "../../events/types";
import { formatEventDate, formatEventLocation } from "../../events/utils";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTranslation } from "../../translations/useTranslation";
import { cn } from "../../../lib/utils";
import { ImageWithFallback } from "../figma/ImageWithFallback";

type EventsShowcaseProps = {
  mode?: "page" | "home";
  upcoming: EventItem[];
  archive: EventItem[];
  upcomingLoading: boolean;
  upcomingError: string | null;
  archiveLoading: boolean;
  archiveError: string | null;
};

const copy = {
  he: {
    pageTitle: "אירועים, הופעות ומפגשים",
    pageDescription:
      "לוח חי של מופעים, מפגשים ותאריכים פתוחים לקהל. כשיש אירוע קרוב, הוא מקבל את קדמת הבמה כאן.",
    homeTitle: "אין כרגע אירועים קרובים",
    homeDescription:
      "עד שיתפרסם התאריך הבא, עמוד הבית מציג את לוח האירועים והארכיון האחרון במקום להשאיר חלל ריק.",
    leadTitle: "האירוע הבא",
    homeLeadTitle: "בינתיים, מהזירה של הארכיון",
    scheduleTitle: "לוח התוכנית",
    archiveTitle: "אירועים אחרונים בארכיון",
    archiveDescription: "מפגשים והופעות שכבר התקיימו, ונשארו כחלק מהזיכרון החי של המקום.",
    viewArchivePage: "לעמוד האירועים",
    soldOut: "אזל מהמלאי",
    ticketButton: "לכרטיסים",
    detailsSoon: "פרטים מלאים בקרוב",
    noUpcoming: "אין כרגע תאריך עתידי פתוח לקהל.",
    noUpcomingDescription:
      "כשתתווסף הופעה או מפגש חדש, היא תופיע כאן אוטומטית. עד אז אפשר לעיין בארכיון הקרוב.",
    noArchive: "עדיין אין אירועי עבר להצגה.",
    noArchiveDescription: "ברגע שפעילות תסתיים, היא תופיע כאן אוטומטית.",
    upcomingUnavailable: "לא ניתן לטעון את האירועים הקרובים כרגע.",
    archiveUnavailable: "לא ניתן לטעון את ארכיון האירועים כרגע.",
    venueFallback: "מיקום יתעדכן בקרוב",
  },
  en: {
    pageTitle: "Shows, events, and gatherings",
    pageDescription:
      "A live board for performances, gatherings, and public dates. When something is coming up, it takes the front position here.",
    homeTitle: "No upcoming events right now",
    homeDescription:
      "Until the next date is announced, the home page surfaces the events board and recent archive instead of leaving the schedule blank.",
    leadTitle: "Next on the calendar",
    homeLeadTitle: "In the meantime, from the archive",
    scheduleTitle: "Program board",
    archiveTitle: "Recent archive",
    archiveDescription:
      "Past performances and gatherings that remain part of the archive's public memory.",
    viewArchivePage: "Open the events page",
    soldOut: "Sold out",
    ticketButton: "Get tickets",
    detailsSoon: "Full details soon",
    noUpcoming: "There is no upcoming public date at the moment.",
    noUpcomingDescription:
      "As soon as a new performance or gathering is published, it will appear here automatically. Until then, the recent archive stays on view.",
    noArchive: "There are no past events to show yet.",
    noArchiveDescription: "Once activity wraps, it will move here automatically.",
    upcomingUnavailable: "Upcoming events are temporarily unavailable.",
    archiveUnavailable: "The event archive is temporarily unavailable.",
    venueFallback: "Venue details soon",
  },
} as const;

function EventDateBlock({ event }: { event: EventItem }) {
  const { language } = useTranslation();

  if (!event.date) {
    return (
      <div className="flex h-16 w-16 flex-col items-center justify-center border border-black/10 bg-white/75 text-center">
        <span className="text-[0.65rem] uppercase tracking-[0.24em] text-secondary">TBA</span>
      </div>
    );
  }

  const locale = language === "he" ? "he-IL" : "en-US";
  const date = new Date(`${event.date}T12:00:00.000Z`);
  const month = new Intl.DateTimeFormat(locale, {
    month: "short",
    timeZone: "UTC",
  }).format(date);
  const day = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    timeZone: "UTC",
  }).format(date);

  return (
    <div className="flex h-16 w-16 flex-col items-center justify-center border border-black/10 bg-white/75 text-center">
      <span className="text-[0.65rem] uppercase tracking-[0.18em] text-secondary">{month}</span>
      <span className="text-xl font-medium leading-none text-foreground">{day}</span>
    </div>
  );
}

function EventMetaRow({ event }: { event: EventItem }) {
  const { language } = useTranslation();
  const { isRTL } = useLanguage();
  const location = formatEventLocation(event);
  const labels = copy[language];

  return (
    <div
      className={cn(
        "grid gap-3 border-y border-black/8 py-4 text-sm text-secondary md:grid-cols-3",
        isRTL ? "text-right" : "text-left",
      )}
    >
      <div className={cn("flex items-center gap-2", isRTL ? "flex-row-reverse justify-end" : "")}>
        <CalendarDays className="h-4 w-4 text-accent" />
        <span>{formatEventDate(event.date, language)}</span>
      </div>

      <div className={cn("flex items-center gap-2", isRTL ? "flex-row-reverse justify-end" : "")}>
        <Clock3 className="h-4 w-4 text-accent" />
        <span>{event.time ?? labels.detailsSoon}</span>
      </div>

      <div className={cn("flex items-center gap-2", isRTL ? "flex-row-reverse justify-end" : "")}>
        <MapPin className="h-4 w-4 text-accent" />
        <span>{location ?? labels.venueFallback}</span>
      </div>
    </div>
  );
}

function ScheduleRow({ event }: { event: EventItem }) {
  const { language } = useTranslation();
  const { isRTL } = useLanguage();
  const labels = copy[language];
  const location = formatEventLocation(event);
  const hasTickets = !event.soldOut && Boolean(event.ticketsUrl);

  return (
    <article
      className={cn(
        "grid gap-4 border-b border-black/8 py-5 last:border-b-0 md:grid-cols-[4.5rem_minmax(0,1fr)]",
        isRTL ? "text-right" : "text-left",
      )}
    >
      <div className={cn("flex", isRTL ? "md:justify-end" : "md:justify-start")}>
        <EventDateBlock event={event} />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-2xl leading-tight text-foreground">{event.title}</h3>
            <p className="text-sm text-secondary">
              {event.time ?? labels.detailsSoon}
              {location ? ` · ${location}` : ""}
            </p>
          </div>

          {event.soldOut ? (
            <span className="border border-black/10 bg-black px-3 py-1 text-xs uppercase tracking-[0.18em] text-white">
              {labels.soldOut}
            </span>
          ) : event.category ? (
            <span className="border border-black/10 bg-white px-3 py-1 text-xs uppercase tracking-[0.18em] text-secondary">
              {event.category}
            </span>
          ) : null}
        </div>

        <p className="max-w-2xl text-sm leading-relaxed text-secondary">
          {event.shortDescription ?? labels.detailsSoon}
        </p>

        {hasTickets ? (
          <div className={cn("flex", isRTL ? "justify-end" : "justify-start")}>
            <a
              href={event.ticketsUrl ?? undefined}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 border border-accent bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
            >
              <Ticket className="h-4 w-4" />
              <span>{labels.ticketButton}</span>
            </a>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function ArchiveCard({ event }: { event: EventItem }) {
  const { language } = useTranslation();
  const { isRTL } = useLanguage();
  const location = formatEventLocation(event);

  return (
    <article className="flex h-full flex-col border border-black/8 bg-[rgba(255,255,255,0.72)]">
      {event.imageUrl ? (
        <ImageWithFallback
          src={event.imageUrl}
          alt={event.title}
          className="aspect-[16/10] w-full border-b border-black/8 object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : null}

      <div className={cn("flex h-full flex-col gap-4 p-5", isRTL ? "text-right" : "text-left")}>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-secondary">
            {formatEventDate(event.date, language)}
          </p>
          <h3 className="text-2xl leading-tight text-foreground">{event.title}</h3>
        </div>

        <p className="line-clamp-3 text-sm leading-relaxed text-secondary">
          {event.shortDescription ?? copy[language].detailsSoon}
        </p>

        <div className="mt-auto flex flex-wrap gap-3 text-sm text-secondary">
          {event.time ? <span>{event.time}</span> : null}
          {location ? <span>{location}</span> : null}
        </div>
      </div>
    </article>
  );
}

export function EventsShowcase({
  mode = "page",
  upcoming,
  archive,
  upcomingLoading,
  upcomingError,
  archiveLoading,
  archiveError,
}: EventsShowcaseProps) {
  const { language } = useTranslation();
  const { isRTL } = useLanguage();
  const labels = copy[language];
  const leadEvent = upcoming.find((event) => event.featured) ?? upcoming[0] ?? null;
  const scheduleEvents = leadEvent ? [leadEvent, ...upcoming.filter((event) => event.id !== leadEvent.id)] : upcoming;
  const archivePreview = archive.slice(0, 3);
  const spotlightEvent = leadEvent ?? archive[0] ?? null;
  const isHomeMode = mode === "home";

  return (
    <section className={cn("relative overflow-hidden px-6", isHomeMode ? "py-24" : "py-16")}>
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="overflow-hidden border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(250,247,241,0.84)_100%)] shadow-[0_24px_90px_rgba(17,17,17,0.08)] backdrop-blur-xl"
        >
          <div className="border-b border-black/8 px-6 py-8 md:px-10 md:py-10">
            <div className={cn("grid gap-8 md:grid-cols-[minmax(0,1fr)_16rem]", isRTL ? "text-right" : "text-left")}>
              <div className="space-y-4">
                <p className="text-sm text-secondary">
                  {isHomeMode ? labels.homeTitle : labels.pageTitle}
                </p>
                <h1 className="max-w-4xl text-5xl md:text-6xl lg:text-7xl">
                  {isHomeMode ? labels.homeTitle : labels.pageTitle}
                </h1>
                <p className="max-w-3xl text-lg leading-relaxed text-secondary">
                  {isHomeMode ? labels.homeDescription : labels.pageDescription}
                </p>
              </div>

              <div className={cn("grid gap-px border border-black/8 bg-black/8", isRTL ? "text-right" : "text-left")}>
                <div className="bg-white/80 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-secondary">{labels.scheduleTitle}</p>
                  <p className="mt-3 text-3xl text-foreground">{upcomingLoading ? "..." : scheduleEvents.length}</p>
                </div>
                <div className="bg-white/80 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-secondary">{labels.archiveTitle}</p>
                  <p className="mt-3 text-3xl text-foreground">{archiveLoading ? "..." : archive.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-px bg-black/8 lg:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)]">
            <div className="bg-[rgba(252,249,243,0.86)] p-6 md:p-10">
              {upcomingLoading ? (
                <div className="space-y-6">
                  <div className="h-64 animate-pulse bg-stone-200/70 md:h-[30rem]" />
                  <div className="h-8 w-40 animate-pulse bg-stone-200/70" />
                  <div className="h-14 w-4/5 animate-pulse bg-stone-200/70" />
                  <div className="h-24 animate-pulse bg-stone-200/70" />
                </div>
              ) : upcomingError ? (
                <div className={cn("space-y-4", isRTL ? "text-right" : "text-left")}>
                  <p className="text-sm text-secondary">{labels.leadTitle}</p>
                  <h2 className="text-4xl text-foreground">{labels.upcomingUnavailable}</h2>
                </div>
              ) : spotlightEvent ? (
                <div className="space-y-6">
                  <div className={cn("space-y-2", isRTL ? "text-right" : "text-left")}>
                    <p className="text-sm text-secondary">
                      {leadEvent ? labels.leadTitle : labels.homeLeadTitle}
                    </p>
                    <h2 className="text-4xl md:text-5xl text-foreground">{spotlightEvent.title}</h2>
                  </div>

                  {spotlightEvent.imageUrl ? (
                    <div className="overflow-hidden border border-black/8 bg-white/70">
                      <ImageWithFallback
                        src={spotlightEvent.imageUrl}
                        alt={spotlightEvent.title}
                        className="aspect-[16/10] w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ) : (
                    <div className="flex min-h-64 items-end border border-black/8 bg-[radial-gradient(circle_at_top_right,rgba(200,169,106,0.16),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(243,236,223,0.95))] p-6 md:min-h-[30rem]">
                      <EventDateBlock event={spotlightEvent} />
                    </div>
                  )}

                  <EventMetaRow event={spotlightEvent} />

                  <div
                    className={cn(
                      "grid gap-6 md:grid-cols-[minmax(0,1fr)_15rem]",
                      isRTL ? "text-right" : "text-left",
                    )}
                  >
                    <p className="text-base leading-relaxed text-secondary">
                      {spotlightEvent.shortDescription ??
                        (leadEvent ? labels.detailsSoon : labels.archiveDescription)}
                    </p>

                    <div className="space-y-3 border border-black/8 bg-white/78 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-secondary">
                        {spotlightEvent.category ?? labels.scheduleTitle}
                      </p>
                      {leadEvent && !spotlightEvent.soldOut && spotlightEvent.ticketsUrl ? (
                        <a
                          href={spotlightEvent.ticketsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-accent bg-accent px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                        >
                          <Ticket className="h-4 w-4" />
                          <span>{labels.ticketButton}</span>
                        </a>
                      ) : (
                        <Link
                          to="/events"
                          className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-black/10 bg-white px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/30 hover:text-accent"
                        >
                          <span>{labels.viewArchivePage}</span>
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      )}

                      {leadEvent && spotlightEvent.soldOut ? (
                        <p className="text-sm text-secondary">{labels.soldOut}</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={cn("space-y-4", isRTL ? "text-right" : "text-left")}>
                  <p className="text-sm text-secondary">{labels.leadTitle}</p>
                  <h2 className="text-4xl md:text-5xl text-foreground">{labels.noUpcoming}</h2>
                  <p className="max-w-2xl text-base leading-relaxed text-secondary">
                    {labels.noUpcomingDescription}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white/72 p-6 md:p-8">
              <div className={cn("space-y-5", isRTL ? "text-right" : "text-left")}>
                <div className="space-y-2">
                  <h2 className="text-3xl text-foreground">{labels.scheduleTitle}</h2>
                  <p className="text-sm leading-relaxed text-secondary">
                    {leadEvent ? labels.pageDescription : labels.noUpcomingDescription}
                  </p>
                </div>

                {upcomingLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="grid gap-4 border-b border-black/8 py-5 md:grid-cols-[4.5rem_minmax(0,1fr)]">
                        <div className="h-16 w-16 animate-pulse bg-stone-200/70" />
                        <div className="space-y-3">
                          <div className="h-6 w-2/3 animate-pulse bg-stone-200/70" />
                          <div className="h-4 w-1/2 animate-pulse bg-stone-200/70" />
                          <div className="h-14 animate-pulse bg-stone-200/70" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : upcomingError ? (
                  <p className="border border-amber-200/80 bg-amber-50/70 p-4 text-sm text-secondary">
                    {labels.upcomingUnavailable}
                  </p>
                ) : scheduleEvents.length > 0 ? (
                  <div>
                    {scheduleEvents.map((event) => (
                      <ScheduleRow key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 border border-dashed border-black/10 bg-[rgba(250,247,241,0.84)] p-5">
                    <h3 className="text-2xl text-foreground">{labels.noUpcoming}</h3>
                    <p className="text-sm leading-relaxed text-secondary">{labels.noUpcomingDescription}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-black/8 px-6 py-8 md:px-10 md:py-10">
            <div className={cn("mb-6 flex flex-wrap items-end justify-between gap-4", isRTL ? "flex-row-reverse" : "")}>
              <div className={cn("space-y-2", isRTL ? "text-right" : "text-left")}>
                <h2 className="text-3xl md:text-4xl text-foreground">{labels.archiveTitle}</h2>
                <p className="max-w-3xl text-base leading-relaxed text-secondary">
                  {labels.archiveDescription}
                </p>
              </div>

              {isHomeMode ? (
                <Link
                  to="/events"
                  className="inline-flex min-h-11 items-center gap-2 border border-black/10 bg-white px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent/30 hover:text-accent"
                >
                  <span>{labels.viewArchivePage}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              ) : null}
            </div>

            {archiveLoading ? (
              <div className="grid gap-5 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="border border-black/8 bg-white/70">
                    <div className="aspect-[16/10] animate-pulse bg-stone-200/70" />
                    <div className="space-y-3 p-5">
                      <div className="h-4 w-24 animate-pulse bg-stone-200/70" />
                      <div className="h-8 w-3/4 animate-pulse bg-stone-200/70" />
                      <div className="h-16 animate-pulse bg-stone-200/70" />
                    </div>
                  </div>
                ))}
              </div>
            ) : archiveError ? (
              <p className="border border-amber-200/80 bg-amber-50/70 p-4 text-sm text-secondary">
                {labels.archiveUnavailable}
              </p>
            ) : archivePreview.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-3">
                {archivePreview.map((event) => (
                  <ArchiveCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className={cn("space-y-3 border border-dashed border-black/10 bg-[rgba(250,247,241,0.84)] p-5", isRTL ? "text-right" : "text-left")}>
                <h3 className="text-2xl text-foreground">{labels.noArchive}</h3>
                <p className="text-sm leading-relaxed text-secondary">{labels.noArchiveDescription}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

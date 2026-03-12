import type { EventItem } from "./types";

export const EVENTS_TIME_ZONE = "Asia/Jerusalem";

const localeByLanguage = {
  he: "he-IL",
  en: "en-US",
} as const;

export const formatEventDate = (date: string | null, language: keyof typeof localeByLanguage): string => {
  if (!date) {
    return language === "he" ? "התאריך יתעדכן בקרוב" : "Date to be announced";
  }

  const formatter = new Intl.DateTimeFormat(localeByLanguage[language], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return formatter.format(new Date(`${date}T12:00:00.000Z`));
};

export const formatEventLocation = (event: EventItem): string | null => {
  const parts = [event.venue, event.city].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
};

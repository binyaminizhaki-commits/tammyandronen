import {
  APIErrorCode,
  collectPaginatedAPI,
  isFullPage,
  isNotionClientError,
} from "@notionhq/client";
import type { Client } from "@notionhq/client";
import type {
  DataSourceObjectResponse,
  DatabaseObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type { EventItem, EventsQueryOptions } from "../../src/app/events/types";
import { getNotionClient } from "./notion";

type NotionPageProperty = PageObjectResponse["properties"][string];

type EventsCacheEntry = {
  expiresAt: number;
  events: EventItem[];
  generatedAt: string;
};

type EventsResult = {
  events: EventItem[];
  generatedAt: string;
};

const CACHE_TTL_MS = 60_000;
const EVENTS_TIME_ZONE = "Asia/Jerusalem";

const PROPERTY_ALIASES = {
  slug: ["Slug"],
  date: ["Date", "Event Date"],
  time: ["Time"],
  venue: ["Venue", "Location", "Space"],
  city: ["City"],
  shortDescription: ["Short Description", "Description", "Summary", "Excerpt"],
  ticketsUrl: ["Tickets URL", "Ticket URL", "Tickets", "Link"],
  imageUrl: ["Image", "Image URL", "Poster", "Cover"],
  featured: ["Featured"],
  published: ["Published"],
  soldOut: ["Sold Out", "SoldOut"],
  category: ["Category"],
  sortOrder: ["Sort Order", "Order", "Priority"],
  title: ["Title", "Name"],
} as const;

let eventsCache: EventsCacheEntry | null = null;

export const getEvents = async (options: EventsQueryOptions = {}): Promise<EventsResult> => {
  const { events, generatedAt } = await getAllEvents();
  const scopedEvents = applyEventScope(events, options);

  return {
    events:
      typeof options.limit === "number" && options.limit > 0
        ? scopedEvents.slice(0, options.limit)
        : scopedEvents,
    generatedAt,
  };
};

const getAllEvents = async (): Promise<EventsResult> => {
  const now = Date.now();
  if (eventsCache && eventsCache.expiresAt > now) {
    return {
      events: eventsCache.events,
      generatedAt: eventsCache.generatedAt,
    };
  }

  const databaseId = process.env.NOTION_EVENTS_DATABASE_ID;
  if (!databaseId) {
    throw new Error("Missing NOTION_EVENTS_DATABASE_ID.");
  }

  const notion = getNotionClient();
  const dataSourceId = await resolveEventsDataSourceId(notion, databaseId);
  const pages = await collectPaginatedAPI(notion.dataSources.query, {
    data_source_id: dataSourceId,
    page_size: 100,
  });

  const events = pages.filter(isFullPage).map(mapNotionPageToEvent);
  const generatedAt = new Date().toISOString();

  eventsCache = {
    events,
    generatedAt,
    expiresAt: now + CACHE_TTL_MS,
  };

  return {
    events,
    generatedAt,
  };
};

const resolveEventsDataSourceId = async (notion: Client, id: string): Promise<string> => {
  try {
    const dataSource = (await notion.dataSources.retrieve({
      data_source_id: id,
    })) as DataSourceObjectResponse;

    return dataSource.id;
  } catch (error: unknown) {
    if (!isResolvableLookupError(error)) {
      throw error;
    }
  }

  const database = (await notion.databases.retrieve({
    database_id: id,
  })) as DatabaseObjectResponse & {
    data_sources?: Array<{ id?: string }>;
  };

  const dataSourceId = database.data_sources?.[0]?.id;
  if (!dataSourceId) {
    throw new Error("The Notion events database does not expose a data source.");
  }

  return dataSourceId;
};

const isResolvableLookupError = (error: unknown): boolean =>
  isNotionClientError(error) &&
  (error.code === APIErrorCode.ObjectNotFound || error.code === APIErrorCode.ValidationError);

const applyEventScope = (events: EventItem[], options: EventsQueryOptions): EventItem[] => {
  const today = getCurrentDateStamp();
  const publishedEvents = events.filter((event) => event.published);

  if (options.archive) {
    return publishedEvents
      .filter((event) => isPastEvent(event, today))
      .sort(compareArchiveEvents);
  }

  return publishedEvents
    .filter((event) => isUpcomingEvent(event, today))
    .filter((event) => (options.featured ? event.featured : true))
    .sort(compareEvents);
};

const isUpcomingEvent = (event: EventItem, today: string): boolean =>
  typeof event.date === "string" && event.date >= today;

const isPastEvent = (event: EventItem, today: string): boolean =>
  typeof event.date === "string" && event.date < today;

const compareEvents = (left: EventItem, right: EventItem): number => {
  const leftDate = left.date ?? "9999-12-31";
  const rightDate = right.date ?? "9999-12-31";

  if (leftDate !== rightDate) {
    return leftDate.localeCompare(rightDate);
  }

  const leftOrder = left.sortOrder ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = right.sortOrder ?? Number.MAX_SAFE_INTEGER;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return left.title.localeCompare(right.title);
};

const compareArchiveEvents = (left: EventItem, right: EventItem): number => {
  const leftDate = left.date ?? "0000-00-00";
  const rightDate = right.date ?? "0000-00-00";

  if (leftDate !== rightDate) {
    return rightDate.localeCompare(leftDate);
  }

  const leftOrder = left.sortOrder ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = right.sortOrder ?? Number.MAX_SAFE_INTEGER;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return left.title.localeCompare(right.title);
};

const mapNotionPageToEvent = (page: PageObjectResponse): EventItem => {
  const properties = page.properties;
  const title = getTitle(properties) ?? "Untitled event";
  const slug = toSlug(getTextProperty(properties, PROPERTY_ALIASES.slug) ?? title) || page.id;
  const date = normalizeDateValue(getDateProperty(properties, PROPERTY_ALIASES.date));

  return {
    id: page.id,
    title,
    slug,
    date,
    time: sanitizeString(getTextProperty(properties, PROPERTY_ALIASES.time)),
    venue: sanitizeString(getTextProperty(properties, PROPERTY_ALIASES.venue)),
    city: sanitizeString(getTextProperty(properties, PROPERTY_ALIASES.city)),
    shortDescription: sanitizeString(
      getTextProperty(properties, PROPERTY_ALIASES.shortDescription),
    ),
    ticketsUrl: sanitizeUrl(getUrlProperty(properties, PROPERTY_ALIASES.ticketsUrl)),
    imageUrl: sanitizeUrl(getImageProperty(properties, PROPERTY_ALIASES.imageUrl)),
    featured: getBooleanProperty(properties, PROPERTY_ALIASES.featured),
    published: getBooleanProperty(properties, PROPERTY_ALIASES.published),
    soldOut: getBooleanProperty(properties, PROPERTY_ALIASES.soldOut),
    category: sanitizeString(getSelectProperty(properties, PROPERTY_ALIASES.category)),
    sortOrder: getNumberProperty(properties, PROPERTY_ALIASES.sortOrder),
  };
};

const getTitle = (properties: PageObjectResponse["properties"]): string | null => {
  for (const property of Object.values(properties)) {
    if (property.type === "title") {
      return sanitizeString(property.title.map((item) => item.plain_text).join(""));
    }
  }

  return sanitizeString(getTextProperty(properties, PROPERTY_ALIASES.title));
};

const getProperty = (
  properties: PageObjectResponse["properties"],
  aliases: readonly string[],
): NotionPageProperty | null => {
  const propertyEntries = Object.entries(properties);

  for (const alias of aliases) {
    const normalizedAlias = alias.trim().toLowerCase();
    const matchedEntry = propertyEntries.find(
      ([name]) => name.trim().toLowerCase() === normalizedAlias,
    );

    if (matchedEntry) {
      return matchedEntry[1];
    }
  }

  return null;
};

const getTextProperty = (
  properties: PageObjectResponse["properties"],
  aliases: readonly string[],
): string | null => {
  const property = getProperty(properties, aliases);
  if (!property) {
    return null;
  }

  switch (property.type) {
    case "title":
      return property.title.map((item) => item.plain_text).join("");
    case "rich_text":
      return property.rich_text.map((item) => item.plain_text).join("");
    case "url":
      return property.url;
    case "email":
      return property.email;
    case "phone_number":
      return property.phone_number;
    case "select":
      return property.select?.name ?? null;
    case "status":
      return property.status?.name ?? null;
    case "formula":
      return property.formula.type === "string" ? property.formula.string : null;
    default:
      return null;
  }
};

const getDateProperty = (
  properties: PageObjectResponse["properties"],
  aliases: readonly string[],
): string | null => {
  const property = getProperty(properties, aliases);
  if (!property) {
    return null;
  }

  if (property.type === "date") {
    return property.date?.start ?? null;
  }

  return getTextProperty(properties, aliases);
};

const getUrlProperty = (
  properties: PageObjectResponse["properties"],
  aliases: readonly string[],
): string | null => {
  const property = getProperty(properties, aliases);
  if (!property) {
    return null;
  }

  if (property.type === "url") {
    return property.url;
  }

  if (property.type === "formula" && property.formula.type === "string") {
    return property.formula.string;
  }

  return getTextProperty(properties, aliases);
};

const getImageProperty = (
  properties: PageObjectResponse["properties"],
  aliases: readonly string[],
): string | null => {
  const property = getProperty(properties, aliases);
  if (!property) {
    return null;
  }

  if (property.type === "files") {
    const firstFile = property.files[0];
    if (!firstFile) {
      return null;
    }

    if (firstFile.type === "external") {
      return firstFile.external.url;
    }

    return firstFile.file.url;
  }

  return getUrlProperty(properties, aliases);
};

const getBooleanProperty = (
  properties: PageObjectResponse["properties"],
  aliases: readonly string[],
): boolean => {
  const property = getProperty(properties, aliases);
  if (!property) {
    return false;
  }

  if (property.type === "checkbox") {
    return property.checkbox;
  }

  const propertyValue =
    property.type === "select"
      ? property.select?.name
      : property.type === "status"
        ? property.status?.name
        : getTextProperty(properties, aliases);

  return ["true", "yes", "1", "published", "featured", "sold out", "soldout"].includes(
    (propertyValue ?? "").trim().toLowerCase(),
  );
};

const getSelectProperty = (
  properties: PageObjectResponse["properties"],
  aliases: readonly string[],
): string | null => {
  const property = getProperty(properties, aliases);
  if (!property) {
    return null;
  }

  if (property.type === "select") {
    return property.select?.name ?? null;
  }

  if (property.type === "status") {
    return property.status?.name ?? null;
  }

  if (property.type === "multi_select") {
    return property.multi_select[0]?.name ?? null;
  }

  return getTextProperty(properties, aliases);
};

const getNumberProperty = (
  properties: PageObjectResponse["properties"],
  aliases: readonly string[],
): number | null => {
  const property = getProperty(properties, aliases);
  if (!property) {
    return null;
  }

  if (property.type === "number") {
    return typeof property.number === "number" ? property.number : null;
  }

  if (property.type === "formula" && property.formula.type === "number") {
    return typeof property.formula.number === "number" ? property.formula.number : null;
  }

  const numericValue = Number.parseInt(getTextProperty(properties, aliases) ?? "", 10);
  return Number.isFinite(numericValue) ? numericValue : null;
};

const normalizeDateValue = (value: string | null): string | null => {
  if (!value) {
    return null;
  }

  const isoDate = value.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(isoDate) ? isoDate : null;
};

const sanitizeString = (value: string | null | undefined): string | null => {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : null;
};

const sanitizeUrl = (value: string | null | undefined): string | null => {
  const trimmedValue = value?.trim();
  if (!trimmedValue) {
    return null;
  }

  try {
    const url = new URL(trimmedValue);
    return url.toString();
  } catch {
    return null;
  }
};

const toSlug = (value: string): string =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getCurrentDateStamp = (): string => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: EVENTS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(new Date());
  const lookup = new Map(parts.map((part) => [part.type, part.value]));

  return `${lookup.get("year")}-${lookup.get("month")}-${lookup.get("day")}`;
};

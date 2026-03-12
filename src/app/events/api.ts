import type { EventsApiResponse, EventsQueryOptions } from "./types";

const EVENTS_API_PATH = "/api/events";

export const fetchEvents = async (
  options: EventsQueryOptions = {},
  signal?: AbortSignal,
): Promise<EventsApiResponse> => {
  const searchParams = new URLSearchParams();

  if (options.featured) {
    searchParams.set("featured", "true");
  }

  if (options.archive) {
    searchParams.set("archive", "true");
  }

  if (typeof options.limit === "number" && options.limit > 0) {
    searchParams.set("limit", String(options.limit));
  }

  const query = searchParams.toString();
  const response = await fetch(query ? `${EVENTS_API_PATH}?${query}` : EVENTS_API_PATH, {
    signal,
  });

  const payload = (await response.json().catch(() => null)) as EventsApiResponse | null;

  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.message ?? "Unable to load events right now.");
  }

  return payload;
};

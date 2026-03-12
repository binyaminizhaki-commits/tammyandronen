import type { EventsApiResponse } from "../../src/app/events/types";
import { getEvents } from "../lib/events";

type NetlifyEvent = {
  httpMethod: string;
  queryStringParameters?: Record<string, string | undefined> | null;
};

type NetlifyResponse = {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
};

const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
};

const toBoolean = (value: string | undefined): boolean =>
  value === "true" || value === "1" || value === "yes";

const toLimit = (value: string | undefined): number | undefined => {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

const jsonResponse = (statusCode: number, payload: EventsApiResponse): NetlifyResponse => ({
  statusCode,
  headers: JSON_HEADERS,
  body: JSON.stringify(payload),
});

export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  if (event.httpMethod !== "GET") {
    return jsonResponse(405, {
      ok: false,
      events: [],
      generatedAt: new Date().toISOString(),
      message: "Method not allowed.",
    });
  }

  try {
    const featured = toBoolean(event.queryStringParameters?.featured);
    const archive = toBoolean(event.queryStringParameters?.archive);
    const limit = toLimit(event.queryStringParameters?.limit);
    const { events, generatedAt } = await getEvents({ featured, archive, limit });

    return jsonResponse(200, {
      ok: true,
      events,
      generatedAt,
    });
  } catch (error) {
    console.error("[events] Failed to load events from Notion.", error);

    return jsonResponse(502, {
      ok: false,
      events: [],
      generatedAt: new Date().toISOString(),
      message: "Unable to load events right now.",
    });
  }
};

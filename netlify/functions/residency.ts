type NetlifyEvent = {
  httpMethod: string;
  body: string | null;
};

type NetlifyResponse = {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
};

type NotionProperty = {
  type?: string;
  select?: {
    options?: Array<{ name?: string }>;
  };
};

type NotionDatabase = {
  properties?: Record<string, NotionProperty>;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const jsonResponse = (statusCode: number, payload: Record<string, unknown>): NetlifyResponse => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

const asTrimmedString = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

const asRichText = (content: string) => [
  {
    type: "text",
    text: { content },
  },
];

const isValidUrl = (value: string): boolean => {
  if (!value) {
    return false;
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const hasSelectOption = (property: NotionProperty | undefined, optionName: string): boolean => {
  if (!property || property.type !== "select") {
    return false;
  }

  const options = property.select?.options;
  return Array.isArray(options) && options.some((option) => option?.name === optionName);
};

const getDatabaseProperties = async (
  databaseId: string,
  headers: Record<string, string>,
): Promise<Record<string, NotionProperty> | null> => {
  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as NotionDatabase;
  if (!data || typeof data !== "object" || !data.properties) {
    return null;
  }

  return data.properties;
};

export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { ok: false, message: "Method not allowed." });
  }

  let payload: Record<string, unknown>;
  try {
    payload = event.body ? (JSON.parse(event.body) as Record<string, unknown>) : {};
  } catch {
    return jsonResponse(400, { ok: false, message: "Invalid JSON body." });
  }

  const name = asTrimmedString(payload.name);
  const email = asTrimmedString(payload.email);
  const phone = asTrimmedString(payload.phone);
  const portfolioLink = asTrimmedString(payload.portfolioLink);
  const shortBio = asTrimmedString(payload.shortBio);
  const motivation = asTrimmedString(payload.motivation);
  const notes = asTrimmedString(payload.notes);
  const pageUrl = asTrimmedString(payload.pageUrl);

  if (!name || !email || !motivation) {
    return jsonResponse(400, { ok: false, message: "Missing required fields." });
  }

  if (!EMAIL_REGEX.test(email)) {
    return jsonResponse(400, { ok: false, message: "Invalid email." });
  }

  const notionToken = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_RESIDENCY_DB_ID;

  if (!notionToken || !databaseId) {
    return jsonResponse(500, { ok: false, message: "Server configuration error." });
  }

  const notionHeaders = {
    Authorization: `Bearer ${notionToken}`,
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
  };

  try {
    const databaseProperties = await getDatabaseProperties(databaseId, notionHeaders);
    if (!databaseProperties) {
      return jsonResponse(500, { ok: false, message: "Unable to submit application right now." });
    }

    const properties: Record<string, unknown> = {};

    if (databaseProperties.Name?.type === "title") {
      properties.Name = { title: asRichText(name) };
    }

    if (databaseProperties.Email?.type === "email") {
      properties.Email = { email };
    }

    if (phone && databaseProperties.Phone?.type === "rich_text") {
      properties.Phone = { rich_text: asRichText(phone) };
    }

    if (isValidUrl(portfolioLink) && databaseProperties["Portfolio Link"]?.type === "url") {
      properties["Portfolio Link"] = { url: portfolioLink };
    }

    if (shortBio && databaseProperties["Short Bio"]?.type === "rich_text") {
      properties["Short Bio"] = { rich_text: asRichText(shortBio) };
    }

    if (databaseProperties["Why are you applying"]?.type === "rich_text") {
      properties["Why are you applying"] = { rich_text: asRichText(motivation) };
    }

    if (notes && databaseProperties.Notes?.type === "rich_text") {
      properties.Notes = { rich_text: asRichText(notes) };
    }

    if (isValidUrl(pageUrl) && databaseProperties["Page URL"]?.type === "url") {
      properties["Page URL"] = { url: pageUrl };
    }

    if (hasSelectOption(databaseProperties.Status, "New")) {
      properties.Status = { select: { name: "New" } };
    }

    const createResponse = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: notionHeaders,
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties,
      }),
    });

    if (!createResponse.ok) {
      return jsonResponse(500, { ok: false, message: "Unable to submit application right now." });
    }

    return jsonResponse(200, { ok: true });
  } catch {
    return jsonResponse(500, { ok: false, message: "Unable to submit application right now." });
  }
};

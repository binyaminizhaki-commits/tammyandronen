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

const buildRichTextValue = (content: string) => ({ rich_text: asRichText(content) });

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

const isTextProperty = (property: NotionProperty | undefined): boolean =>
  property?.type === "rich_text" || property?.type === "text";

const findSelectOption = (property: NotionProperty | undefined, optionName: string): string | null => {
  if (!property || property.type !== "select") {
    return null;
  }

  const options = property.select?.options;
  if (!Array.isArray(options)) {
    return null;
  }

  const normalizedOptionName = optionName.trim().toLowerCase();
  const matchedOption = options.find((option) => option?.name?.trim().toLowerCase() === normalizedOptionName);
  return matchedOption?.name ?? null;
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
    console.error("[contact] Failed to retrieve Notion database schema.", await response.text());
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
  const subject = asTrimmedString(payload.subject);
  const message = asTrimmedString(payload.message);
  const pageUrl = asTrimmedString(payload.pageUrl);

  if (!name || !email || !message) {
    return jsonResponse(400, { ok: false, message: "Missing required fields." });
  }

  if (!EMAIL_REGEX.test(email)) {
    return jsonResponse(400, { ok: false, message: "Invalid email." });
  }

  const notionToken = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_CONTACT_DB_ID;

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
      return jsonResponse(500, { ok: false, message: "Unable to submit message right now." });
    }

    const properties: Record<string, unknown> = {};

    if (databaseProperties.Name?.type === "title") {
      properties.Name = { title: asRichText(name) };
    }

    if (databaseProperties.Email?.type === "email") {
      properties.Email = { email };
    }

    if (phone && isTextProperty(databaseProperties.Phone)) {
      properties.Phone = buildRichTextValue(phone);
    }

    if (subject && isTextProperty(databaseProperties.Subject)) {
      properties.Subject = buildRichTextValue(subject);
    }

    if (isTextProperty(databaseProperties.Message)) {
      properties.Message = buildRichTextValue(message);
    }

    if (isValidUrl(pageUrl) && databaseProperties["Page URL"]?.type === "url") {
      properties["Page URL"] = { url: pageUrl };
    }

    const statusOption = findSelectOption(databaseProperties.Status, "New");
    if (statusOption) {
      properties.Status = { select: { name: statusOption } };
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
      console.error("[contact] Failed to create message in Notion.", await createResponse.text());
      return jsonResponse(500, { ok: false, message: "Unable to submit message right now." });
    }

    return jsonResponse(200, { ok: true });
  } catch (error) {
    console.error("[contact] Unexpected error while submitting message.", error);
    return jsonResponse(500, { ok: false, message: "Unable to submit message right now." });
  }
};

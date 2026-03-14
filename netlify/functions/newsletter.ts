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

type NotionPageResult = {
  id?: string;
};

type NotionQueryResult = {
  results?: NotionPageResult[];
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s\-()]{8,}$/;

const jsonResponse = (statusCode: number, payload: Record<string, unknown>): NetlifyResponse => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

const asTrimmedString = (value: unknown): string => (typeof value === "string" ? value.trim() : "");
const asBoolean = (value: unknown): boolean => value === true;

const asRichText = (content: string) => [
  {
    type: "text",
    text: { content },
  },
];

const buildTitleValue = (content: string) => ({ title: asRichText(content) });
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

const findSelectOption = (property: NotionProperty | undefined, optionNames: string[]): string | null => {
  if (!property || property.type !== "select") {
    return null;
  }

  const options = property.select?.options;
  if (!Array.isArray(options)) {
    return null;
  }

  const normalizedOptionNames = optionNames.map((name) => name.trim().toLowerCase());
  const matchedOption = options.find((option) => {
    const optionName = option?.name?.trim().toLowerCase();
    return optionName ? normalizedOptionNames.includes(optionName) : false;
  });

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
    console.error("[newsletter] Failed to retrieve Notion database schema.", await response.text());
    return null;
  }

  const data = (await response.json()) as NotionDatabase;
  if (!data || typeof data !== "object" || !data.properties) {
    return null;
  }

  return data.properties;
};

const getDuplicateFilter = (propertyName: string, property: NotionProperty | undefined, value: string) => {
  switch (property?.type) {
    case "email":
      return { property: propertyName, email: { equals: value } };
    case "title":
      return { property: propertyName, title: { equals: value } };
    case "rich_text":
    case "text":
      return { property: propertyName, rich_text: { equals: value } };
    default:
      return null;
  }
};

const findTitlePropertyName = (properties: Record<string, NotionProperty>): string | null =>
  Object.entries(properties).find(([, property]) => property?.type === "title")?.[0] ?? null;

const findPropertyEntry = (
  properties: Record<string, NotionProperty>,
  candidates: string[],
): [string, NotionProperty] | null => {
  const normalizedCandidates = candidates.map((candidate) => candidate.toLowerCase());
  const entry = Object.entries(properties).find(([name]) => normalizedCandidates.includes(name.toLowerCase()));
  return entry ?? null;
};

const applyPhoneProperty = (
  propertiesPayload: Record<string, unknown>,
  propertyName: string,
  property: NotionProperty | undefined,
  phone: string,
) => {
  if (!phone || !property) {
    return;
  }

  if (property.type === "phone_number") {
    propertiesPayload[propertyName] = { phone_number: phone };
    return;
  }

  if (property.type === "title") {
    propertiesPayload[propertyName] = buildTitleValue(phone);
    return;
  }

  if (isTextProperty(property)) {
    propertiesPayload[propertyName] = buildRichTextValue(phone);
  }
};

const applyBooleanProperty = (
  propertiesPayload: Record<string, unknown>,
  propertyName: string,
  property: NotionProperty | undefined,
  value: boolean,
) => {
  if (!property) {
    return;
  }

  if (property.type === "checkbox") {
    propertiesPayload[propertyName] = { checkbox: value };
    return;
  }

  if (property.type === "title") {
    propertiesPayload[propertyName] = buildTitleValue(value ? "Yes" : "No");
    return;
  }

  if (isTextProperty(property)) {
    propertiesPayload[propertyName] = buildRichTextValue(value ? "Yes" : "No");
    return;
  }

  if (property.type === "select") {
    const selectedOption = value
      ? findSelectOption(property, ["Yes", "כן", "Subscribed", "Requested", "Active"])
      : findSelectOption(property, ["No", "לא", "Inactive"]);

    if (selectedOption) {
      propertiesPayload[propertyName] = { select: { name: selectedOption } };
    }
  }
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

  const email = asTrimmedString(payload.email).toLowerCase();
  const phone = asTrimmedString(payload.phone);
  const newsletter = asBoolean(payload.newsletter);
  const whatsapp = asBoolean(payload.whatsapp);
  const name = asTrimmedString(payload.name);
  const source = asTrimmedString(payload.source) || "website";
  const pageUrl = asTrimmedString(payload.pageUrl);

  if (!email) {
    return jsonResponse(400, { ok: false, message: "Missing required email." });
  }

  if (!EMAIL_REGEX.test(email)) {
    return jsonResponse(400, { ok: false, message: "Invalid email." });
  }

  if (!newsletter && !whatsapp) {
    return jsonResponse(400, { ok: false, message: "At least one channel is required." });
  }

  if (whatsapp && !PHONE_REGEX.test(phone)) {
    return jsonResponse(400, { ok: false, message: "A valid phone number is required for WhatsApp." });
  }

  const notionToken = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_NEWSLETTER_DB_ID;

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
      return jsonResponse(500, { ok: false, message: "Unable to subscribe right now." });
    }

    const emailProperty = databaseProperties.Email;
    const duplicateFilter = getDuplicateFilter("Email", emailProperty, email);

    let existingPageId: string | null = null;
    if (duplicateFilter) {
      const queryResponse = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
        method: "POST",
        headers: notionHeaders,
        body: JSON.stringify({
          page_size: 1,
          filter: duplicateFilter,
        }),
      });

      if (!queryResponse.ok) {
        console.error("[newsletter] Failed to query existing subscribers in Notion.", await queryResponse.text());
        return jsonResponse(500, { ok: false, message: "Unable to subscribe right now." });
      }

      const queryData = (await queryResponse.json()) as NotionQueryResult;
      existingPageId = queryData.results?.[0]?.id ?? null;
    }

    const properties: Record<string, unknown> = {};

    if (emailProperty?.type === "email") {
      properties.Email = { email };
    } else if (emailProperty?.type === "title") {
      properties.Email = buildTitleValue(email);
    } else if (isTextProperty(emailProperty)) {
      properties.Email = buildRichTextValue(email);
    }

    const nameProperty = databaseProperties.Name;
    if (name) {
      if (nameProperty?.type === "title") {
        properties.Name = buildTitleValue(name);
      } else if (isTextProperty(nameProperty)) {
        properties.Name = buildRichTextValue(name);
      }
    }

    const sourceProperty = databaseProperties.Source;
    const resolvedSource =
      findSelectOption(sourceProperty, [source]) ??
      findSelectOption(sourceProperty, source.includes("popup") ? ["Popup"] : []) ??
      findSelectOption(sourceProperty, source.includes("landing") ? ["Landing"] : []) ??
      findSelectOption(sourceProperty, ["Website", "website"]);
    if (resolvedSource) {
      properties.Source = { select: { name: resolvedSource } };
    } else if (isTextProperty(sourceProperty)) {
      properties.Source = buildRichTextValue(source);
    }

    if (isValidUrl(pageUrl) && databaseProperties["Page URL"]?.type === "url") {
      properties["Page URL"] = { url: pageUrl };
    }

    if (databaseProperties.Consent?.type === "checkbox") {
      properties.Consent = { checkbox: true };
    }

    const phoneEntry = findPropertyEntry(databaseProperties, ["Phone", "טלפון"]);
    if (phoneEntry) {
      applyPhoneProperty(properties, phoneEntry[0], phoneEntry[1], phone);
    }

    const newsletterEntry = findPropertyEntry(databaseProperties, ["Newsletter", "ניוזלטר"]);
    if (newsletterEntry) {
      applyBooleanProperty(properties, newsletterEntry[0], newsletterEntry[1], newsletter);
    }

    const whatsappEntry = findPropertyEntry(databaseProperties, ["WhatsApp", "Whatsapp", "וואטסאפ"]);
    if (whatsappEntry) {
      applyBooleanProperty(properties, whatsappEntry[0], whatsappEntry[1], whatsapp);
    }

    const doubleOptInStatus = findSelectOption(databaseProperties["Double opt in status"], ["Pending"]);
    if (doubleOptInStatus) {
      properties["Double opt in status"] = { select: { name: doubleOptInStatus } };
    }

    const statusOption = findSelectOption(databaseProperties.Status, ["Pending", "New"]);
    if (statusOption) {
      properties.Status = { select: { name: statusOption } };
    }

    const titlePropertyName = findTitlePropertyName(databaseProperties);
    if (titlePropertyName && !(titlePropertyName in properties)) {
      properties[titlePropertyName] = buildTitleValue(email);
    }

    const response = existingPageId
      ? await fetch(`https://api.notion.com/v1/pages/${existingPageId}`, {
          method: "PATCH",
          headers: notionHeaders,
          body: JSON.stringify({ properties }),
        })
      : await fetch("https://api.notion.com/v1/pages", {
          method: "POST",
          headers: notionHeaders,
          body: JSON.stringify({
            parent: { database_id: databaseId },
            properties,
          }),
        });

    if (!response.ok) {
      console.error(
        existingPageId
          ? "[newsletter] Failed to update subscriber in Notion."
          : "[newsletter] Failed to create subscriber in Notion.",
        await response.text(),
      );
      return jsonResponse(500, { ok: false, message: "Unable to subscribe right now." });
    }

    return jsonResponse(200, {
      ok: true,
      already: Boolean(existingPageId),
      updated: Boolean(existingPageId),
    });
  } catch (error) {
    console.error("[newsletter] Unexpected error while subscribing.", error);
    return jsonResponse(500, { ok: false, message: "Unable to subscribe right now." });
  }
};

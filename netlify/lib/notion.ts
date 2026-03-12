import { Client } from "@notionhq/client";

let notionClient: Client | null = null;

export const getNotionClient = (): Client => {
  const token = process.env.NOTION_TOKEN;

  if (!token) {
    throw new Error("Missing NOTION_TOKEN.");
  }

  if (!notionClient) {
    notionClient = new Client({
      auth: token,
      timeoutMs: 15_000,
      retry: {
        maxRetries: 2,
        initialRetryDelayMs: 500,
        maxRetryDelayMs: 5_000,
      },
    });
  }

  return notionClient;
};

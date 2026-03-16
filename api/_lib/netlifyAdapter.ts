type NetlifyResponse = {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
};

type VercelRequestLike = {
  method?: string;
  body?: unknown;
  query?: Record<string, string | string[] | undefined>;
};

type VercelResponseLike = {
  setHeader(name: string, value: string): void;
  status(code: number): VercelResponseLike;
  send(body: string): void;
};

export const toSingleValue = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

export const toRequestBody = (body: unknown): string | null => {
  if (typeof body === "string") {
    return body;
  }

  if (body == null) {
    return null;
  }

  return JSON.stringify(body);
};

export const sendNetlifyResponse = (
  response: VercelResponseLike,
  result: NetlifyResponse,
): void => {
  for (const [name, value] of Object.entries(result.headers)) {
    response.setHeader(name, value);
  }

  response.status(result.statusCode).send(result.body);
};

export type { NetlifyResponse, VercelRequestLike, VercelResponseLike };

import { handler as netlifyHandler } from "../netlify/functions/newsletter";
import {
  sendNetlifyResponse,
  toRequestBody,
  type VercelRequestLike,
  type VercelResponseLike,
} from "./_lib/netlifyAdapter";

export default async function handler(request: VercelRequestLike, response: VercelResponseLike) {
  const result = await netlifyHandler({
    httpMethod: request.method ?? "GET",
    body: toRequestBody(request.body),
  });

  sendNetlifyResponse(response, result);
}

import { handler as netlifyHandler } from "../netlify/functions/events";
import {
  sendNetlifyResponse,
  toSingleValue,
  type VercelRequestLike,
  type VercelResponseLike,
} from "./_lib/netlifyAdapter";

export default async function handler(request: VercelRequestLike, response: VercelResponseLike) {
  const result = await netlifyHandler({
    httpMethod: request.method ?? "GET",
    queryStringParameters: {
      featured: toSingleValue(request.query?.featured),
      archive: toSingleValue(request.query?.archive),
      limit: toSingleValue(request.query?.limit),
    },
  });

  sendNetlifyResponse(response, result);
}

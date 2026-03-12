export interface EventItem {
  id: string;
  title: string;
  slug: string;
  date: string | null;
  time: string | null;
  venue: string | null;
  city: string | null;
  shortDescription: string | null;
  ticketsUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  published: boolean;
  soldOut: boolean;
  category: string | null;
  sortOrder: number | null;
}

export interface EventsApiResponse {
  ok: boolean;
  events: EventItem[];
  generatedAt: string;
  message?: string;
}

export interface EventsQueryOptions {
  featured?: boolean;
  archive?: boolean;
  limit?: number;
}

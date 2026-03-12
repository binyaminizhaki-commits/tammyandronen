import { useEffect, useState } from "react";
import { fetchEvents } from "./api";
import type { EventItem, EventsQueryOptions } from "./types";

type UseEventsState = {
  events: EventItem[];
  loading: boolean;
  error: string | null;
};

export const useEvents = (options: EventsQueryOptions = {}): UseEventsState => {
  const [state, setState] = useState<UseEventsState>({
    events: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    setState((currentState) => ({
      ...currentState,
      loading: true,
      error: null,
    }));

    fetchEvents(options, controller.signal)
      .then((payload) => {
        setState({
          events: payload.events,
          loading: false,
          error: null,
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setState({
          events: [],
          loading: false,
          error: error instanceof Error ? error.message : "Unable to load events right now.",
        });
      });

    return () => controller.abort();
  }, [options.archive, options.featured, options.limit]);

  return state;
};

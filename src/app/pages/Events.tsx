import { motion } from "motion/react";
import { Navigation } from "../components/Navigation";
import { UnifiedBackground } from "../components/UnifiedBackground";
import { EventsShowcase } from "../components/events/EventsShowcase";
import { useEvents } from "../events/useEvents";

export function Events() {
  const upcoming = useEvents();
  const archive = useEvents({ archive: true });

  return (
    <div className="min-h-screen pt-24">
      <UnifiedBackground />
      <Navigation />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <EventsShowcase
          upcoming={upcoming.events}
          archive={archive.events}
          upcomingLoading={upcoming.loading}
          upcomingError={upcoming.error}
          archiveLoading={archive.loading}
          archiveError={archive.error}
        />
      </motion.div>
    </div>
  );
}

import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Footer } from "./Footer";
import { FloatingSidebar } from "./FloatingSidebar";
import { ParticlesBackground } from "./ParticlesBackground";

export function Layout() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col relative">
      <ParticlesBackground />
      <FloatingSidebar />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

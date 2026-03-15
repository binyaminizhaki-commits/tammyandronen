import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Footer } from "./Footer";
import { ParticlesBackground } from "./ParticlesBackground";

export function Layout() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      <ParticlesBackground />
      <main className="relative z-10 flex-1 overflow-x-clip">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

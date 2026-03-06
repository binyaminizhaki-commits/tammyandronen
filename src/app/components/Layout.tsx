import { Outlet } from "react-router";
import { Footer } from "./Footer";
import { FloatingSidebar } from "./FloatingSidebar";
import { ParticlesBackground } from "./ParticlesBackground";

export function Layout() {
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
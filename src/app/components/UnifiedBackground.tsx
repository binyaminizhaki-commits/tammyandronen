import { FlickeringGrid } from "./ui/flickering-grid";

export function UnifiedBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      {/* Base warm background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-warmGray-50/30 to-amber-50/20" />
      
      {/* Flickering Grid Overlay */}
      <FlickeringGrid
        className="absolute inset-0"
        squareSize={4}
        gridGap={6}
        color="#C8A96A"
        maxOpacity={0.15}
        flickerChance={0.05}
      />
      
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/30" />
    </div>
  );
}

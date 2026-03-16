import { useEffect, useRef } from "react";

export function InkTrailCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const points: { x: number; y: number }[] = [];
    let currentThickness = 1.5;
    let idleTimeout: number | undefined;
    const fadeSpeed = 0.06;
    let lastDrawTime = Date.now();
    let animationFrameId = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const onMove = (x: number, y: number) => {
      lastDrawTime = Date.now();

      window.clearTimeout(idleTimeout);
      idleTimeout = window.setTimeout(() => {
        points.length = 0;
      }, 500);

      points.push({ x, y });

      if (points.length > 3) {
        points.shift();
      }

      if (points.length === 3) {
        const p0 = points[0];
        const p1 = points[1];
        const p2 = points[2];

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const targetThickness = Math.max(0.4, 2.5 - distance * 0.04);
        currentThickness += (targetThickness - currentThickness) * 0.2;

        const prevXc = (p0.x + p1.x) / 2;
        const prevYc = (p0.y + p1.y) / 2;
        const xc = (p1.x + p2.x) / 2;
        const yc = (p1.y + p2.y) / 2;

        ctx.globalCompositeOperation = "source-over";
        ctx.beginPath();
        ctx.moveTo(prevXc, prevYc);
        ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
        ctx.lineWidth = currentThickness;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#0a1128";
        ctx.stroke();
      } else if (points.length === 2) {
        ctx.globalCompositeOperation = "source-over";
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineTo(points[1].x, points[1].y);
        ctx.lineWidth = currentThickness;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#0a1128";
        ctx.stroke();
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      onMove(event.clientX, event.clientY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) {
        return;
      }

      onMove(touch.clientX, touch.clientY);
    };

    const animate = () => {
      if (Date.now() - lastDrawTime > 800) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = `rgba(0, 0, 0, ${fadeSpeed})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationFrameId = window.requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(idleTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}

import { useEffect, useRef } from "react";

type TrailPoint = {
  x: number;
  y: number;
  time: number;
};

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

    const inputQueue: TrailPoint[] = [];
    const points: TrailPoint[] = [];
    let currentThickness = 1.5;
    let idleTimeout: number | undefined;
    const fadeSpeed = 0.045;
    let lastDrawTime = performance.now();
    let animationFrameId = 0;
    let lastInputPoint: TrailPoint | null = null;
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;

      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      canvas.width = Math.floor(viewportWidth * dpr);
      canvas.height = Math.floor(viewportHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };

    const onMove = (x: number, y: number) => {
      const now = performance.now();
      const nextPoint = { x, y, time: now };

      lastDrawTime = now;

      window.clearTimeout(idleTimeout);
      idleTimeout = window.setTimeout(() => {
        points.length = 0;
        inputQueue.length = 0;
        lastInputPoint = null;
      }, 500);

      if (!lastInputPoint) {
        inputQueue.push(nextPoint);
        lastInputPoint = nextPoint;
        return;
      }

      const distance = Math.hypot(x - lastInputPoint.x, y - lastInputPoint.y);
      const steps = Math.max(1, Math.ceil(distance / 2));

      for (let index = 1; index <= steps; index += 1) {
        const t = index / steps;
        inputQueue.push({
          x: lastInputPoint.x + (x - lastInputPoint.x) * t,
          y: lastInputPoint.y + (y - lastInputPoint.y) * t,
          time: lastInputPoint.time + (now - lastInputPoint.time) * t,
        });
      }

      lastInputPoint = nextPoint;
    };

    const drawSegment = () => {
      if (points.length < 2) {
        return;
      }

      const latest = points[points.length - 1];
      const previous = points[points.length - 2];
      const distance = Math.hypot(latest.x - previous.x, latest.y - previous.y);
      const deltaTime = Math.max(8, latest.time - previous.time);
      const speed = distance / deltaTime;
      const targetThickness = Math.max(0.4, 2.6 - speed * 18);

      currentThickness += (targetThickness - currentThickness) * 0.16;

      ctx.globalCompositeOperation = "source-over";

      if (points.length === 2) {
        ctx.globalCompositeOperation = "source-over";
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineTo(points[1].x, points[1].y);
        ctx.lineWidth = currentThickness;
        ctx.strokeStyle = "#0a1128";
        ctx.stroke();
        return;
      }

      const p0 = points[points.length - 3];
      const p1 = points[points.length - 2];
      const p2 = points[points.length - 1];
      const prevXc = (p0.x + p1.x) / 2;
      const prevYc = (p0.y + p1.y) / 2;
      const xc = (p1.x + p2.x) / 2;
      const yc = (p1.y + p2.y) / 2;

      ctx.beginPath();
      ctx.moveTo(prevXc, prevYc);
      ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
      ctx.lineWidth = currentThickness;
      ctx.strokeStyle = "#0a1128";
      ctx.stroke();
    };

    const handlePointerMove = (event: PointerEvent) => {
      onMove(event.clientX, event.clientY);
    };

    const animate = () => {
      const now = performance.now();

      if (now - lastDrawTime > 900) {
        ctx.clearRect(0, 0, viewportWidth, viewportHeight);
      } else {
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = `rgba(0, 0, 0, ${fadeSpeed})`;
        ctx.fillRect(0, 0, viewportWidth, viewportHeight);
      }

      while (inputQueue.length > 0) {
        const point = inputQueue.shift();
        if (!point) {
          break;
        }

        points.push(point);

        if (points.length > 3) {
          points.shift();
        }

        drawSegment();
      }

      animationFrameId = window.requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove);
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

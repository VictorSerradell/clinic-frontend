import React, { useEffect, useRef } from "react";

interface HologramCanvasProps {
  scanSpeed?: number;
  wireframeOpacity?: number;
  rotationSpeed?: number;
  isScanning?: boolean;
}

export const HologramCanvas: React.FC<HologramCanvasProps> = ({
  scanSpeed = 1.0,
  wireframeOpacity = 0.6,
  rotationSpeed = 0.5,
  isScanning = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let angle = 0;
    let scanLineY = 0;
    let scanDirection = 1;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = Math.min(cx, cy) - 20;

      // 1. Grid de fondo estilo radar quirúrgico
      ctx.strokeStyle = "rgba(2, 132, 199, 0.08)";
      ctx.lineWidth = 1;
      for (let r = 20; r <= radius; r += 25) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.stroke();

      // 2. Anillo reticular giratorio
      angle += 0.01 * rotationSpeed;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.strokeStyle = `rgba(13, 148, 136, ${wireframeOpacity})`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 12]);
      ctx.beginPath();
      ctx.arc(0, 0, radius - 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 3. Renderizado de puntos 3D simulando silueta/organo
      const time = Date.now() * 0.002 * scanSpeed;
      ctx.fillStyle = `rgba(2, 132, 199, ${wireframeOpacity * 0.8})`;

      for (let i = 0; i < 180; i++) {
        const phi = Math.acos(-1 + (2 * i) / 180);
        const theta = Math.sqrt(180 * Math.PI) * phi + time;
        const x = cx + radius * 0.5 * Math.cos(theta) * Math.sin(phi);
        const y = cy + radius * 0.5 * Math.sin(theta) * Math.sin(phi);

        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Barrido de láser de escaneo
      if (isScanning) {
        scanLineY += 1.5 * scanDirection * scanSpeed;
        if (scanLineY > radius || scanLineY < -radius) {
          scanDirection *= -1;
        }

        const currentScanY = cy + scanLineY;
        const gradient = ctx.createLinearGradient(
          0,
          currentScanY - 15,
          0,
          currentScanY + 15,
        );
        gradient.addColorStop(0, "rgba(2, 132, 199, 0)");
        gradient.addColorStop(0.5, "rgba(2, 132, 199, 0.4)");
        gradient.addColorStop(1, "rgba(2, 132, 199, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(cx - radius, currentScanY - 15, radius * 2, 30);

        ctx.strokeStyle = "#0284C7";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - radius, currentScanY);
        ctx.lineTo(cx + radius, currentScanY);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [scanSpeed, wireframeOpacity, rotationSpeed, isScanning]);

  return (
    <div className="relative flex items-center justify-center p-4 bg-slate-900/5 rounded-xl border border-slate-200 shadow-inner">
      <canvas
        ref={canvasRef}
        width={320}
        height={320}
        className="max-w-full h-auto"
      />
      <div className="absolute top-3 left-3 text-[10px] font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
        HOLO_SCANNER :: ACTIVE
      </div>
    </div>
  );
};

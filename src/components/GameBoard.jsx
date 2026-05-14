import React, { useEffect, useRef } from "react";
import { COLS, ROWS } from "../utils/helpers";

const CELL = 24; // Tamanho de célula em pixels

export default function GameBoard({ snake, food, ate }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Redesenha o canvas toda vez que a cobra/comida mudar
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Limpa o canvas antes de desenhar o novo frame
    ctx.fillStyle = "#1e1e2a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Linhas de grade
    ctx.strokeStyle = "#2a2a3d";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, ROWS * CELL);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(COLS * CELL, y * CELL);
      ctx.stroke();
    }

    // Brilho ao redor da comida
    const fx = food.x * CELL + CELL / 2;
    const fy = food.y * CELL + CELL / 2;
    const gradient = ctx.createRadialGradient(fx, fy, 0, fx, fy, CELL);
    gradient.addColorStop(0, "rgba(255, 215, 0, 0.3)");
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.fillRect(
      food.x * CELL - CELL,
      food.y * CELL - CELL,
      CELL * 3,
      CELL * 3,
    );

    // Quadradinho/Comida (ficando maior 1 frame quando a cobra acaba de comer)
    ctx.fillStyle = "#ffd700";
    ctx.shadowColor = "#ffd700";
    ctx.shadowBlur = 12;
    const size = ate ? CELL * 0.75 : CELL * 0.55;
    const offset = (CELL - size) / 2;
    ctx.fillRect(food.x * CELL + offset, food.y * CELL + offset, size, size);
    ctx.shadowBlur = 0;

    // Desenha a cobra
    snake.forEach((seg, i) => {
      const isHead = i === 0;
      const px = seg.x * CELL;
      const py = seg.y * CELL;
      const pad = isHead ? 1 : 2; // Cabeça é um pocuo maior que o corpo

      if (isHead) {
        ctx.fillStyle = "#39ff14";
        ctx.shadowColor = "#39ff14";
        ctx.shadowBlur = 16;
      } else {
        const fade = Math.max(0.3, 1 - i / snake.length);
        ctx.fillStyle = `rgba(34, 139, 18, ${fade})`;
        ctx.shadowBlur = 0;
      }

      ctx.fillRect(px + pad, py + pad, CELL - pad * 2, CELL - pad * 2);
      ctx.shadowBlur = 0;

      // Olhinhos da cobra
      if (isHead) {
        ctx.fillStyle = "#0d1117";
        ctx.fillRect(px + 6, py + 6, 3, 3);
        ctx.fillRect(px + 15, py + 6, 3, 3);
      }
    });
  }, [snake, food, ate]);

  return (
    <canvas
      ref={canvasRef}
      width={COLS * CELL}
      height={ROWS * CELL}
      style={{
        display: "block",
        border: "1px solid #1e1e2e",
        borderRadius: "4px",
      }}
    />
  );
}

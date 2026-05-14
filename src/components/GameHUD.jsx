import React from "react";
import { padScore } from "../utils/helpers";

// Estilos principais do HUD (Heads-Up Display)
const styles = {
  hud: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "12px 4px",
    fontFamily: "'Press Start 2P', monospace",
  },
  block: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "8px",
    color: "#666680",
    letterSpacing: "1px",
  },
  value: {
    fontSize: "16px",
    color: "#39ff14",
    textShadow: "0 0 10px #39ff14, 0 0 20px #39ff1440",
  },
  highValue: {
    fontSize: "16px",
    color: "#ffd700",
    textShadow: "0 0 10px #ffd700, 0 0 20px #ffd70040",
  },
};

export default function GameHUD({ score, highScore }) {
  return (
    <div style={styles.hud}>
      <div style={styles.block}>
        <span style={styles.label}>PONTOS</span>
        <span style={styles.value}>{padScore(score)}</span>
      </div>

      <div style={{ ...styles.block, alignItems: "flex-end" }}>
        <span style={{ ...styles.label, textAlign: "right" }}>
          MELHOR PONTUAÇÃO
        </span>
        <span
          style={{ ...styles.highValue, textAlign: "right", width: "100%" }}
        >
          {padScore(highScore)}
        </span>
      </div>
    </div>
  );
}

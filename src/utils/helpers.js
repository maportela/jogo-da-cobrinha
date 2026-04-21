// Dimensões da grade do jogo
export const COLS = 25;
export const ROWS = 20;

// speed (quanto menor + rápido) e scoreMultiplier (multiplicador de pontos por comida)
export const DIFFICULTIES = {
  easy: { label: "FÁCIL", speed: 180, scoreMultiplier: 1 },
  medium: { label: "MÉDIO", speed: 120, scoreMultiplier: 2 },
  hard: { label: "DIFÍCIL", speed: 70, scoreMultiplier: 3 },
};

// Posição inicial da cobra
export function getInitialSnake() {
  return [
    { x: 12, y: 10 },
    { x: 11, y: 10 },
    { x: 10, y: 10 },
  ];
}

// Posição aleatória da comida sem cair na cobra
export function getRandomFood(snake) {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

// True se bateu nas bordas
export function checkWallCollision(head) {
  return head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS;
}

// True se bateu em si própria
export function checkSelfCollision(head, snake) {
  return snake.some((s) => s.x === head.x && s.y === head.y);
}

// Formata o ranking
export function padScore(score) {
  return String(score).padStart(5, "0");
}

export function getHighScores() {
  try {
    return JSON.parse(localStorage.getItem("snakeHighScores") || "[]");
  } catch {
    return [];
  }
}

// Salva a pontuação atual e coloca do maior pro menor no top 10
export function saveHighScore(score, difficulty) {
  const scores = getHighScores();
  scores.push({
    score,
    difficulty,
    date: new Date().toLocaleDateString("pt-BR"),
  });
  scores.sort((a, b) => b.score - a.score);
  const top10 = scores.slice(0, 10);
  localStorage.setItem("snakeHighScores", JSON.stringify(top10));
  return top10;
}

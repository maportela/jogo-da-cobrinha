import { useState, useEffect, useRef, useCallback } from "react";
import {
  DIFFICULTIES,
  getInitialSnake,
  getRandomFood,
  checkWallCollision,
  checkSelfCollision,
  saveHighScore,
  getHighScores,
} from "../utils/helpers";

export function useSnakeGame(difficulty) {
  // Estados do jogo que o React monitora pra reddesenhar
  const [snake, setSnake] = useState(getInitialSnake());
  const [food, setFood] = useState({ x: 18, y: 10 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState("idle"); // parado/rodando/pausado/fim
  const [ate, setAte] = useState(false);

  // Refs porque o setInterval captura o valor no momento em que é criado, não o valor atual
  const dirRef = useRef({ x: 1, y: 0 });
  const nextDirRef = useRef({ x: 1, y: 0 });
  const snakeRef = useRef(getInitialSnake());
  const foodRef = useRef({ x: 18, y: 10 });
  const scoreRef = useRef(0);
  const intervalRef = useRef(null); // referência ao setInterval pra poder cancelá-lo depois

  const config = DIFFICULTIES[difficulty];

  // Reseta todas as variáveis pro estado inicial sem recarregar a página
  const resetGame = useCallback(() => {
    const initialSnake = getInitialSnake();
    const initialFood = { x: 18, y: 10 };
    snakeRef.current = initialSnake;
    foodRef.current = initialFood;
    scoreRef.current = 0;
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    setSnake(initialSnake);
    setFood(initialFood);
    setScore(0);
    setAte(false);
  }, []);

  // Executa a cada intervalo do jogo (move a cobra um passo à frente)
  const step = useCallback(() => {
    dirRef.current = nextDirRef.current;

    // Calcula a posição da nova cabeça com base na direção atual
    const head = {
      x: snakeRef.current[0].x + dirRef.current.x,
      y: snakeRef.current[0].y + dirRef.current.y,
    };

    // Colisão com parede ou com o próprio corpo perde o jogo
    if (
      checkWallCollision(head) ||
      checkSelfCollision(head, snakeRef.current)
    ) {
      clearInterval(intervalRef.current);
      const newScores = saveHighScore(scoreRef.current, difficulty);
      setHighScore(newScores[0]?.score ?? 0);
      setGameState("gameover");
      return;
    }

    // Adiciona a nova cabeça no início (a cobra andou)
    const newSnake = [head, ...snakeRef.current];
    const ateFood =
      head.x === foodRef.current.x && head.y === foodRef.current.y;

    if (ateFood) {
      const points = 10 * DIFFICULTIES[difficulty].scoreMultiplier;
      scoreRef.current += points;
      setScore(scoreRef.current);
      setAte(true);
      setTimeout(() => setAte(false), 200); // anima a comida
      const newFood = getRandomFood(newSnake);
      foodRef.current = newFood;
      setFood(newFood);
    } else {
      newSnake.pop(); // remove a cauda pra compensar a cabeça que foi adicionada
    }

    snakeRef.current = newSnake;
    setSnake([...newSnake]); // cópia do array pro React detectar a mudança e redesenhar
  }, [difficulty]);

  const startGame = useCallback(() => {
    resetGame();
    setGameState("running");
  }, [resetGame]);

  const togglePause = useCallback(() => {
    setGameState((prev) => (prev === "running" ? "paused" : "running"));
  }, []);

  const goToMenu = useCallback(() => {
    setGameState("idle");
  }, []);

  // Começar ou parar o jogo baseado no estado dele
  useEffect(() => {
    if (gameState === "running") {
      intervalRef.current = setInterval(step, config.speed);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [gameState, step, config.speed]);

  // Controles no teclado (WASD/Setas)
  useEffect(() => {
    const handleKey = (e) => {
      const key = e.key;
      const cur = dirRef.current;

      if (key === "p" || key === "P" || key === "Escape") {
        if (gameState === "running" || gameState === "paused") togglePause();
        return;
      }

      if (gameState !== "running") return;

      const moves = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        d: { x: 1, y: 0 },
        W: { x: 0, y: -1 },
        S: { x: 0, y: 1 },
        A: { x: -1, y: 0 },
        D: { x: 1, y: 0 },
      };

      const newDir = moves[key];
      if (!newDir) return;

      // Prevenção de reverse (virar a cobra sobre si mesma)
      if (newDir.x === -cur.x && newDir.y === -cur.y) return;

      e.preventDefault(); // evitar que as setas rolem a página
      nextDirRef.current = newDir;
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameState, togglePause]);

  // Carrega as pontuações
  useEffect(() => {
    const scores = getHighScores();
    setHighScore(scores[0]?.score ?? 0);
  }, []);

  return {
    snake,
    food,
    score,
    highScore,
    gameState,
    ate,
    startGame,
    togglePause,
    goToMenu,
  };
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, RefreshCw } from 'lucide-react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = GRID_SIZE * CELL_SIZE;
      canvas.height = GRID_SIZE * CELL_SIZE;
    }
  }, []);

  const generateFood = useCallback((): Point => {
    let newFood: Point;
    let isOnSnake = true;
    while (isOnSnake) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) return newFood;
    }
    return { x: 0, y: 0 }; // Should not happen
  }, [snake]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setGameStarted(true);
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted && e.code === 'Space') {
        resetGame();
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (direction !== 'DOWN') setNextDirection('UP');
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (direction !== 'UP') setNextDirection('DOWN');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (direction !== 'RIGHT') setNextDirection('LEFT');
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (direction !== 'LEFT') setNextDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameStarted]);

  // Game Loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const moveSnake = () => {
      setDirection(nextDirection);
      
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };

        switch (nextDirection) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        // Check collision with walls
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood());
          // Don't pop the tail, so snake grows
        } else {
          newSnake.pop(); // Remove tail
        }

        return newSnake;
      });
    };

    const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 5);
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [gameStarted, gameOver, nextDirection, food, generateFood, score, highScore]);

  // Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000000'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (raw lines)
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw Food (Square, Magenta)
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(
      food.x * CELL_SIZE + 2,
      food.y * CELL_SIZE + 2,
      CELL_SIZE - 4,
      CELL_SIZE - 4
    );

    // Draw Snake (Square, Cyan)
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#ffffff' : '#00ffff'; // Head is white, body is cyan
      
      ctx.fillRect(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
      
      // Inner detail for snake
      if (!isHead) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(
            segment.x * CELL_SIZE + 4,
            segment.y * CELL_SIZE + 4,
            CELL_SIZE - 8,
            CELL_SIZE - 8
        );
      }
    });

    // Scanline effect on canvas
    ctx.fillStyle = "rgba(0, 255, 255, 0.05)";
    for (let i = 0; i < canvas.height; i += 4) {
        ctx.fillRect(0, i, canvas.width, 1);
    }

  }, [snake, food, gameOver]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[400px]">
      <div className="flex w-full justify-between text-[#00ffff] font-mono border-b-2 border-[#00ffff] pb-2">
        <div className="flex flex-col items-start">
          <span className="text-xl font-bold glitch" data-text={score}>SCORE: {score}</span>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-[#ff00ff]" />
            <span className="text-xl font-bold text-[#ff00ff]">{highScore}</span>
          </div>
        </div>
      </div>

      <div className="relative group w-full aspect-square">
        <canvas 
          ref={canvasRef} 
          className={`w-full h-full border-4 border-[#00ffff] bg-black shadow-[0_0_20px_rgba(0,255,255,0.4)] ${gameOver ? 'opacity-50 grayscale' : ''}`}
          style={{ imageRendering: 'pixelated' }}
        />
        
        {(!gameStarted || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-none border-4 border-[#ff00ff] m-4">
            <h3 className="text-5xl font-bold text-[#ff00ff] mb-4 glitch" data-text={gameOver ? 'FATAL_ERROR' : 'INSERT_COIN'}>
              {gameOver ? 'FATAL_ERROR' : 'INSERT_COIN'}
            </h3>
            <p className="text-[#00ffff] font-mono text-lg mb-8 animate-pulse">
              {gameOver ? `SCORE: ${score}` : 'PRESS_START'}
            </p>
            <button 
              onClick={resetGame}
              className="flex items-center gap-2 px-8 py-4 bg-[#00ffff] hover:bg-white text-black font-bold text-xl uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[4px_4px_0px_#ff00ff]"
            >
              <RefreshCw size={24} />
              {gameOver ? 'REBOOT' : 'START'}
            </button>
          </div>
        )}
      </div>

      <div className="text-[#00ffff]/50 font-mono text-sm uppercase tracking-widest w-full text-center border-t border-[#00ffff]/30 pt-4">
        [ARROWS] TO NAVIGATE // [SPACE] TO REBOOT
      </div>
    </div>
  );
}

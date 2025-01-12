import { useState, useEffect } from "react";
import Airplane from "./Airplane";

// Constants for game dimensions
const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;

// Constants for player, bullet, and enemy speeds
const PLAYER_SPEED = 5;
const BULLET_SPEED = 7;
const ENEMY_SPEED = 3;

// Constants for player and enemy dimensions
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 40;
const ENEMY_WIDTH = 30;
const ENEMY_HEIGHT = 30;

// Constant for bullet dimensions
const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 10;

// Constant for maximum number of bullets
const MAX_BULLETS = 5;

// Constant for enemy spawn probability
const ENEMY_SPAWN_PROBABILITY = 0.02;

// Constant for frame rate
const FRAME_RATE = 60;

const AirplaneFighter = () => {
  const [gameState, setGameState] = useState({
    isPlaying: false,
    score: 0,
    playerPosition: { x: 50, y: 80 },
    bullets: [],
    enemies: [],
    gameOver: false,
  });

  const [keys, setKeys] = useState({
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
    Space: false,
  });

  const movePlayer = (position, keys) => {
    let { x, y } = position;

    if (keys.ArrowLeft) x = Math.max(0, x - PLAYER_SPEED);
    if (keys.ArrowRight)
      x = Math.min(GAME_WIDTH - PLAYER_WIDTH, x + PLAYER_SPEED);
    if (keys.ArrowUp) y = Math.max(0, y - PLAYER_SPEED);
    if (keys.ArrowDown)
      y = Math.min(GAME_HEIGHT - PLAYER_HEIGHT, y + PLAYER_SPEED);

    return { x, y };
  };

  const updateBullets = (bullets, playerPosition, keys) => {
    // Move existing bullets
    const updatedBullets = bullets
      .map((bullet) => ({ ...bullet, y: bullet.y - BULLET_SPEED }))
      .filter((bullet) => bullet.y > 0);

    // Add new bullet if space is pressed
    if (keys.Space && bullets.length < MAX_BULLETS) {
      updatedBullets.push({
        x: playerPosition.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
        y: playerPosition.y,
        id: Date.now(),
      });
    }

    return updatedBullets;
  };

  const updateEnemies = (enemies) => {
    // Move existing enemies
    const updatedEnemies = enemies
      .map((enemy) => ({ ...enemy, y: enemy.y + ENEMY_SPEED }))
      .filter((enemy) => enemy.y < GAME_HEIGHT);

    // Spawn new enemies
    if (Math.random() < ENEMY_SPAWN_PROBABILITY) {
      updatedEnemies.push({
        x: Math.random() * (GAME_WIDTH - ENEMY_WIDTH),
        y: -ENEMY_HEIGHT,
        id: Date.now(),
      });
    }

    return updatedEnemies;
  };

  const checkCollisions = (bullets, enemies, playerPosition) => {
    let score = 0;
    const updatedEnemies = [...enemies];

    // Check bullet-enemy collisions
    bullets.forEach((bullet) => {
      updatedEnemies.forEach((enemy, index) => {
        if (
          bullet.x < enemy.x + ENEMY_WIDTH &&
          bullet.x + BULLET_WIDTH > enemy.x &&
          bullet.y < enemy.y + ENEMY_HEIGHT &&
          bullet.y + BULLET_HEIGHT > enemy.y
        ) {
          updatedEnemies.splice(index, 1);
          score += 10;
        }
      });
    });

    // Check player-enemy collisions
    const gameOver = updatedEnemies.some(
      (enemy) =>
        playerPosition.x < enemy.x + ENEMY_WIDTH &&
        playerPosition.x + PLAYER_WIDTH > enemy.x &&
        playerPosition.y < enemy.y + ENEMY_HEIGHT &&
        playerPosition.y + PLAYER_HEIGHT > enemy.y
    );

    return { updatedEnemies, score, gameOver };
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (Object.keys(keys).includes(e.code)) {
        setKeys((prev) => ({ ...prev, [e.code]: true }));
      }
    };

    const handleKeyUp = (e) => {
      if (Object.keys(keys).includes(e.code)) {
        setKeys((prev) => ({ ...prev, [e.code]: false }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameState.isPlaying || gameState.gameOver) return;

    const gameLoop = setInterval(() => {
      setGameState((prev) => {
        const newPlayerPosition = movePlayer(prev.playerPosition, keys);
        const updatedBullets = updateBullets(
          prev.bullets,
          newPlayerPosition,
          keys
        );
        const updatedEnemies = updateEnemies(prev.enemies);

        const {
          updatedEnemies: finalEnemies,
          score,
          gameOver,
        } = checkCollisions(updatedBullets, updatedEnemies, newPlayerPosition);

        return {
          ...prev,
          playerPosition: newPlayerPosition,
          bullets: updatedBullets,
          enemies: finalEnemies,
          score: prev.score + score,
          gameOver,
        };
      });
    }, 1000 / FRAME_RATE);

    return () => clearInterval(gameLoop);
  }, [gameState.isPlaying, gameState.gameOver, keys]);

  const startGame = () => {
    setGameState({
      isPlaying: true,
      score: 0,
      playerPosition: { x: 50, y: 80 },
      bullets: [],
      enemies: [],
      gameOver: false,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg">
        <div className="text-center mb-4">
          <div className="text-xl font-bold mb-2">Score: {gameState.score}</div>
          {!gameState.isPlaying && !gameState.gameOver && (
            <button
              onClick={startGame}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Start Game
            </button>
          )}
          {gameState.gameOver && (
            <div>
              <div className="text-red-500 text-xl mb-2">Game Over!</div>
              <button
                onClick={startGame}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
        <div
          className="relative bg-gray-900 mx-auto overflow-hidden"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        >
          {gameState.isPlaying && (
            <>
              <div
                className="absolute"
                style={{
                  left: gameState.playerPosition.x,
                  top: gameState.playerPosition.y,
                  width: PLAYER_WIDTH,
                  height: PLAYER_HEIGHT,
                }}
              >
                <Airplane />
              </div>

              {gameState.bullets.map((bullet) => (
                <div
                  key={bullet.id}
                  className="absolute bg-yellow-400 rounded-full"
                  style={{
                    left: bullet.x,
                    top: bullet.y,
                    width: BULLET_WIDTH,
                    height: BULLET_HEIGHT,
                  }}
                />
              ))}

              {gameState.enemies.map((enemy) => (
                <div
                  key={enemy.id}
                  className="absolute"
                  style={{
                    left: enemy.x,
                    top: enemy.y,
                    width: ENEMY_WIDTH,
                    height: ENEMY_HEIGHT,
                    transform: "rotate(180deg)",
                  }}
                >
                  <Airplane />
                </div>
              ))}
            </>
          )}
        </div>
        <div className="text-center mt-4 text-sm text-gray-600">
          Use arrow keys to move, space to shoot
        </div>
      </div>
    </div>
  );
};

export default AirplaneFighter;

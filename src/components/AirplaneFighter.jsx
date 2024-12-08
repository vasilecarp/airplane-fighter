import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const Airplane = ({ color = "#3B82F6" }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <path
      d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z"
      fill={color}
      stroke="white"
      strokeWidth="2"
    />
    <path
      d="M45 35 L55 35 L50 15 Z"
      fill="darkgray"
      stroke="white"
      strokeWidth="1"
    />
    <path
      d="M35 45 L35 55 L15 50 Z"
      fill="darkgray"
      stroke="white"
      strokeWidth="1"
    />
    <path
      d="M65 45 L65 55 L85 50 Z"
      fill="darkgray"
      stroke="white"
      strokeWidth="1"
    />
    <circle cx="50" cy="50" r="5" fill="darkgray" stroke="white" />
  </svg>
);

Airplane.propTypes = {
  color: PropTypes.string,
};

Airplane.defaultProps = {
  color: "#3B82F6",
};

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

  const GAME_WIDTH = 400;
  const GAME_HEIGHT = 600;
  const PLAYER_SPEED = 5;
  const BULLET_SPEED = 7;
  const ENEMY_SPEED = 3;

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
        // Move player
        let newX = prev.playerPosition.x;
        let newY = prev.playerPosition.y;

        if (keys.ArrowLeft) newX = Math.max(0, newX - PLAYER_SPEED);
        if (keys.ArrowRight)
          newX = Math.min(GAME_WIDTH - 40, newX + PLAYER_SPEED);
        if (keys.ArrowUp) newY = Math.max(0, newY - PLAYER_SPEED);
        if (keys.ArrowDown)
          newY = Math.min(GAME_HEIGHT - 40, newY + PLAYER_SPEED);

        // Move bullets
        const updatedBullets = prev.bullets
          .map((bullet) => ({ ...bullet, y: bullet.y - BULLET_SPEED }))
          .filter((bullet) => bullet.y > 0);

        // Move enemies
        const updatedEnemies = prev.enemies
          .map((enemy) => ({ ...enemy, y: enemy.y + ENEMY_SPEED }))
          .filter((enemy) => enemy.y < GAME_HEIGHT);

        // Spawn new enemies
        if (Math.random() < 0.02) {
          updatedEnemies.push({
            x: Math.random() * (GAME_WIDTH - 30),
            y: -30,
            id: Date.now(),
          });
        }

        // Check collisions
        let newScore = prev.score;
        let gameOver = prev.gameOver;

        // Bullet hits enemy
        updatedBullets.forEach((bullet) => {
          updatedEnemies.forEach((enemy, index) => {
            if (
              bullet.x < enemy.x + 30 &&
              bullet.x + 5 > enemy.x &&
              bullet.y < enemy.y + 30 &&
              bullet.y + 10 > enemy.y
            ) {
              updatedEnemies.splice(index, 1);
              newScore += 10;
            }
          });
        });

        // Enemy hits player
        updatedEnemies.forEach((enemy) => {
          if (
            newX < enemy.x + 30 &&
            newX + 40 > enemy.x &&
            newY < enemy.y + 30 &&
            newY + 40 > enemy.y
          ) {
            gameOver = true;
          }
        });

        // Add new bullet if space is pressed
        if (keys.Space && prev.bullets.length < 5) {
          updatedBullets.push({
            x: newX + 17.5,
            y: newY,
            id: Date.now(),
          });
        }

        return {
          ...prev,
          playerPosition: { x: newX, y: newY },
          bullets: updatedBullets,
          enemies: updatedEnemies,
          score: newScore,
          gameOver,
        };
      });
    }, 1000 / 60); // 60 FPS

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
    <div className="w-full max-w-lg mx-auto p-4">
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
            {/* Player */}
            <div
              className="absolute"
              style={{
                left: gameState.playerPosition.x,
                top: gameState.playerPosition.y,
                width: 40,
                height: 40,
              }}
            >
              <Airplane color="#3B82F6" />
            </div>

            {/* Bullets */}
            {gameState.bullets.map((bullet) => (
              <div
                key={bullet.id}
                className="absolute bg-yellow-400 rounded-full"
                style={{
                  left: bullet.x,
                  top: bullet.y,
                  width: 5,
                  height: 10,
                }}
              />
            ))}

            {/* Enemies */}
            {gameState.enemies.map((enemy) => (
              <div
                key={enemy.id}
                className="absolute"
                style={{
                  left: enemy.x,
                  top: enemy.y,
                  width: 30,
                  height: 30,
                }}
              >
                <Airplane color="#EF4444" />
              </div>
            ))}
          </>
        )}
      </div>
      <div className="text-center mt-4 text-sm text-gray-600">
        Use arrow keys to move, space to shoot
      </div>
    </div>
  );
};

export default AirplaneFighter;

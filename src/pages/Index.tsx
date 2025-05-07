
import React from 'react';
import GameBoard from '../components/GameBoard';
import NextPiece from '../components/NextPiece';
import ScoreBoard from '../components/ScoreBoard';
import Controls from '../components/Controls';
import { useGameState } from '../game/useGameState';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const { gameState, dispatch } = useGameState();
  const { board, score, level, linesCleared, nextPiece, currentPiece, gameOver, paused } = gameState;
  const isMobile = useIsMobile();

  // Show game over toast
  React.useEffect(() => {
    if (gameOver) {
      toast({
        title: "Game Over!",
        description: `Final score: ${score}`,
      });
    }
  }, [gameOver, score]);

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">Tetris</h1>
          <p className="text-gray-400">A classic puzzle game</p>
        </div>

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="mb-4">
            <div className="bg-red-500 text-white p-3 rounded text-center font-bold animate-game-over-flash">
              Game Over! Your score: {score}
            </div>
          </div>
        )}
        
        {/* Main Game Layout */}
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center gap-6`}>
          {/* Game Board */}
          <div className="relative">
            <GameBoard board={board} currentPiece={currentPiece} />
            
            {/* Pause Overlay */}
            {paused && !gameOver && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                <div className="text-white text-2xl font-bold">PAUSED</div>
              </div>
            )}
          </div>

          {/* Game Info and Controls */}
          <div className={`flex ${isMobile ? 'flex-row' : 'flex-col'} gap-6`}>
            <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4`}>
              <div className="flex flex-col gap-4">
                <NextPiece piece={nextPiece} />
                <ScoreBoard score={score} level={level} linesCleared={linesCleared} />
              </div>
            </div>
            
            <div className={isMobile ? "w-full" : "w-44"}>
              <Controls 
                dispatch={dispatch} 
                isPaused={paused} 
                isGameOver={gameOver} 
              />
            </div>
          </div>
        </div>
        
        {/* Keyboard Instructions */}
        <div className="mt-8 text-center text-gray-400 max-w-md mx-auto">
          <h3 className="font-medium mb-2">Keyboard Controls:</h3>
          <p className="text-sm">
            Arrow Keys: Move • Up: Rotate • Space: Hard Drop • P: Pause • R: Restart
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;

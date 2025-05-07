
import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, GameAction } from './types';
import { initGame, updateGame, gameTick, BOARD_HEIGHT, BOARD_WIDTH } from './gameLogic';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initGame);
  const gameTickRef = useRef<number | null>(null);
  
  // Handle game tick
  const tick = useCallback(() => {
    setGameState(prevState => gameTick(prevState));
  }, []);
  
  // Start game timer
  const startGameTimer = useCallback(() => {
    if (gameTickRef.current) return;
    
    const getTickSpeed = (level: number) => {
      // Speed increases with level (milliseconds between ticks)
      return Math.max(100, 1000 - (level - 1) * 100);
    };
    
    const runGameLoop = () => {
      tick();
      gameTickRef.current = window.setTimeout(
        runGameLoop,
        getTickSpeed(gameState.level)
      );
    };
    
    gameTickRef.current = window.setTimeout(
      runGameLoop,
      getTickSpeed(gameState.level)
    );
    
  }, [gameState.level, tick]);
  
  // Stop game timer
  const stopGameTimer = useCallback(() => {
    if (gameTickRef.current) {
      clearTimeout(gameTickRef.current);
      gameTickRef.current = null;
    }
  }, []);
  
  // Handle user actions
  const dispatch = useCallback((action: GameAction) => {
    setGameState(prevState => updateGame(prevState, action));
    
    // Special handling for restart
    if (action === GameAction.RESTART) {
      stopGameTimer();
      startGameTimer();
    }
  }, [startGameTimer, stopGameTimer]);
  
  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          dispatch(GameAction.LEFT);
          break;
        case 'ArrowRight':
          dispatch(GameAction.RIGHT);
          break;
        case 'ArrowDown':
          dispatch(GameAction.DOWN);
          break;
        case 'ArrowUp':
          dispatch(GameAction.ROTATE);
          break;
        case ' ':
          dispatch(GameAction.HARD_DROP);
          break;
        case 'p':
        case 'P':
          dispatch(GameAction.PAUSE);
          break;
        case 'r':
        case 'R':
          dispatch(GameAction.RESTART);
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch]);
  
  // Start the game when mounted and clean up on unmount
  useEffect(() => {
    startGameTimer();
    
    return () => {
      stopGameTimer();
    };
  }, [startGameTimer, stopGameTimer]);
  
  // Pause/resume the game timer based on game state
  useEffect(() => {
    if (gameState.paused || gameState.gameOver) {
      stopGameTimer();
    } else {
      startGameTimer();
    }
  }, [gameState.paused, gameState.gameOver, startGameTimer, stopGameTimer]);
  
  return {
    gameState,
    dispatch,
    BOARD_WIDTH,
    BOARD_HEIGHT,
  };
};

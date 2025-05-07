import { GameState, GameAction, CellType, Tetromino, TetrominoType } from './types';
import { randomTetromino, rotateTetromino, checkCollision } from './tetrominoes';

// Constants for the game board
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

// Points awarded for clearing lines
const POINTS = {
  1: 100,
  2: 300,
  3: 500,
  4: 800,
};

// Create an empty game board
export const createEmptyBoard = (): CellType[][] =>
  Array.from({ length: BOARD_HEIGHT }, () => 
    Array(BOARD_WIDTH).fill(null)
  );

// Initialize a new game
export const initGame = (): GameState => {
  return {
    board: createEmptyBoard(),
    currentPiece: randomTetromino(),
    nextPiece: randomTetromino(),
    score: 0,
    level: 1,
    linesCleared: 0,
    gameOver: false,
    paused: false,
  };
};

// Merge the current tetromino with the game board
const mergePieceWithBoard = (state: GameState): CellType[][] => {
  if (!state.currentPiece) return state.board;
  
  const newBoard = JSON.parse(JSON.stringify(state.board)) as CellType[][];
  const { shape, position, type } = state.currentPiece;
  
  shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        const boardY = y + position.y;
        const boardX = x + position.x;
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = type;
        }
      }
    });
  });
  
  return newBoard;
};

// Check and clear completed lines
const clearLines = (board: CellType[][]): { newBoard: CellType[][], linesCleared: number } => {
  let linesCleared = 0;
  const newBoard = board.filter(row => {
    const isLineComplete = row.every(cell => cell !== null);
    if (isLineComplete) {
      linesCleared += 1;
    }
    return !isLineComplete;
  });
  
  // Add new empty lines at the top
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }
  
  return { newBoard, linesCleared };
};

// Calculate the new score based on lines cleared
const calculateScore = (state: GameState, linesCleared: number): { score: number, level: number } => {
  if (linesCleared === 0) return { score: state.score, level: state.level };
  
  const linePoints = POINTS[linesCleared as keyof typeof POINTS] || 0;
  const newScore = state.score + linePoints * state.level;
  
  // Level up every 10 lines
  const totalLinesCleared = state.linesCleared + linesCleared;
  const newLevel = Math.floor(totalLinesCleared / 10) + 1;
  
  return { 
    score: newScore,
    level: newLevel
  };
};

// Move the current tetromino
const moveTetromino = (state: GameState, dx: number, dy: number): GameState => {
  if (!state.currentPiece || state.gameOver || state.paused) return state;
  
  const newPosition = {
    x: state.currentPiece.position.x + dx,
    y: state.currentPiece.position.y + dy,
  };
  
  // Check for collisions
  const hasCollision = checkCollision(
    { ...state.currentPiece, position: newPosition },
    state.board
  );
  
  if (!hasCollision) {
    return {
      ...state,
      currentPiece: {
        ...state.currentPiece,
        position: newPosition,
      },
    };
  }
  
  // If moving down and there's a collision, lock the piece
  if (dy > 0) {
    // Merge the current piece with the board
    const newBoard = mergePieceWithBoard(state);
    
    // Check for game over - if collision happens at the top rows
    const isGameOver = state.currentPiece.position.y <= 1;
    
    if (isGameOver) {
      return { ...state, board: newBoard, gameOver: true };
    }
    
    // Clear completed lines
    const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
    
    // Calculate new score and level
    const { score, level } = calculateScore(state, linesCleared);
    
    // Update the state with the next piece
    return {
      ...state,
      board: clearedBoard,
      currentPiece: state.nextPiece,
      nextPiece: randomTetromino(),
      score,
      level,
      linesCleared: state.linesCleared + linesCleared,
    };
  }
  
  return state;
};

// Hard drop the tetromino
const hardDrop = (state: GameState): GameState => {
  if (!state.currentPiece || state.gameOver || state.paused) return state;
  
  let newY = state.currentPiece.position.y;
  let collision = false;
  
  // Keep moving down until collision
  while (!collision) {
    newY += 1;
    collision = checkCollision(
      { 
        ...state.currentPiece, 
        position: { ...state.currentPiece.position, y: newY } 
      },
      state.board
    );
  }
  
  // Move to the last valid position (one step back)
  return moveTetromino(state, 0, newY - state.currentPiece.position.y - 1);
};

// Rotate the current tetromino
const rotatePiece = (state: GameState): GameState => {
  if (!state.currentPiece || state.gameOver || state.paused) return state;
  
  // Special case for O-tetromino (doesn't rotate)
  if (state.currentPiece.type === 'O') return state;
  
  const newShape = rotateTetromino(state.currentPiece);
  const rotatedPiece = {
    ...state.currentPiece,
    shape: newShape,
  };
  
  // Wall kicks - try different positions if rotation causes collision
  const kicks = [
    { x: 0, y: 0 },    // original position
    { x: -1, y: 0 },   // left
    { x: 1, y: 0 },    // right
    { x: 0, y: -1 },   // up
    { x: -1, y: -1 },  // up-left
    { x: 1, y: -1 },   // up-right
  ];
  
  for (const kick of kicks) {
    const kickedPosition = {
      x: state.currentPiece.position.x + kick.x,
      y: state.currentPiece.position.y + kick.y,
    };
    
    const hasCollision = checkCollision(
      { ...rotatedPiece, position: kickedPosition },
      state.board
    );
    
    if (!hasCollision) {
      return {
        ...state,
        currentPiece: {
          ...rotatedPiece,
          position: kickedPosition,
        },
      };
    }
  }
  
  // If all kick attempts failed, don't rotate
  return state;
};

// Main game update function
export const updateGame = (state: GameState, action: GameAction): GameState => {
  if (state.gameOver && action !== GameAction.RESTART) {
    return state;
  }
  
  if (action === GameAction.PAUSE) {
    return { ...state, paused: !state.paused };
  }
  
  if (state.paused && action !== GameAction.RESTART) {
    return state;
  }
  
  switch (action) {
    case GameAction.LEFT:
      return moveTetromino(state, -1, 0);
    case GameAction.RIGHT:
      return moveTetromino(state, 1, 0);
    case GameAction.DOWN:
      return moveTetromino(state, 0, 1);
    case GameAction.ROTATE:
      return rotatePiece(state);
    case GameAction.HARD_DROP:
      return hardDrop(state);
    case GameAction.RESTART:
      return initGame();
    default:
      return state;
  }
};

// Game tick function - moves the current piece down
export const gameTick = (state: GameState): GameState => {
  if (state.gameOver || state.paused) return state;
  return moveTetromino(state, 0, 1);
};

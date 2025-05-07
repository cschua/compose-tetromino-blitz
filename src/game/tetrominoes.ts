
import { Tetromino, TetrominoType, Position } from './types';

// Define the shapes of each tetromino
export const TETROMINOES = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
};

// Generate a random tetromino
export const randomTetromino = (): Tetromino => {
  const types: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  return {
    type,
    shape: TETROMINOES[type],
    position: { x: type === 'I' || type === 'O' ? 3 : 4, y: 0 },
  };
};

// Rotate a tetromino (90 degrees clockwise)
export const rotateTetromino = (tetromino: Tetromino): number[][] => {
  const { shape } = tetromino;
  const newShape = Array(shape.length)
    .fill(null)
    .map(() => Array(shape.length).fill(0));

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      newShape[x][shape.length - 1 - y] = shape[y][x];
    }
  }

  return newShape;
};

// Check for collisions
export const checkCollision = (
  tetromino: Tetromino,
  board: (TetrominoType | null)[][],
  position?: Position
) => {
  // Use the provided position or the tetromino's position
  const pos = position || tetromino.position;
  
  // Loop through the tetromino shape
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      // Only check filled cells
      if (tetromino.shape[y][x] !== 0) {
        const newX = pos.x + x;
        const newY = pos.y + y;
        
        // Check boundaries
        const isOutOfBounds = 
          newX < 0 || 
          newX >= board[0].length || 
          newY >= board.length;
          
        // Check for existing blocks on the board
        const isCollision = 
          newY >= 0 && 
          board[newY] && 
          board[newY][newX] !== null;
          
        if (isOutOfBounds || isCollision) {
          return true;
        }
      }
    }
  }
  
  return false;
};

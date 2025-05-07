
// Types for the tetromino shapes and game board

export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export type CellType = TetrominoType | null;

export interface Position {
  x: number;
  y: number;
}

export interface Tetromino {
  type: TetrominoType;
  shape: number[][];
  position: Position;
}

export interface GameState {
  board: CellType[][];
  currentPiece: Tetromino | null;
  nextPiece: Tetromino | null;
  score: number;
  level: number;
  linesCleared: number;
  gameOver: boolean;
  paused: boolean;
}

export enum GameAction {
  LEFT,
  RIGHT, 
  DOWN,
  ROTATE,
  HARD_DROP,
  PAUSE,
  RESTART,
}

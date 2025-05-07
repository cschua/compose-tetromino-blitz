
import React from 'react';
import { CellType, Tetromino } from '../game/types';

interface GameBoardProps {
  board: CellType[][];
  currentPiece?: Tetromino | null;
}

const Cell: React.FC<{ type: CellType }> = ({ type }) => {
  const cellClass = type
    ? `bg-tetromino-${type.toLowerCase()} border border-gray-800`
    : 'bg-gray-900 border border-gray-800';

  return <div className={`w-7 h-7 ${cellClass}`} />;
};

const GameBoard: React.FC<GameBoardProps> = ({ board, currentPiece }) => {
  // Create a copy of the board to avoid modifying the original
  const displayBoard = JSON.parse(JSON.stringify(board)) as CellType[][];
  
  // Overlay the current piece on the display board if it exists
  if (currentPiece) {
    const { shape, position, type } = currentPiece;
    
    shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== 0) {
          const boardY = y + position.y;
          const boardX = x + position.x;
          
          // Only draw if within board boundaries and the cell is inside the board vertically
          if (
            boardY >= 0 && 
            boardY < board.length && 
            boardX >= 0 && 
            boardX < board[0].length
          ) {
            displayBoard[boardY][boardX] = type;
          }
        }
      });
    });
  }
  
  return (
    <div className="bg-gray-900 p-1 border-2 border-gray-700 rounded">
      <div className="grid grid-cols-10">
        {displayBoard.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell key={`${rowIndex}-${colIndex}`} type={cell} />
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;

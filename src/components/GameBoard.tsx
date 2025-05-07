
import React from 'react';
import { CellType } from '../game/types';

interface GameBoardProps {
  board: CellType[][];
}

const Cell: React.FC<{ type: CellType }> = ({ type }) => {
  const cellClass = type
    ? `bg-tetromino-${type.toLowerCase()} border border-gray-800`
    : 'bg-gray-900 border border-gray-800';

  return <div className={`w-6 h-6 ${cellClass}`} />;
};

const GameBoard: React.FC<GameBoardProps> = ({ board }) => {
  return (
    <div className="bg-gray-900 p-1 border-2 border-gray-700 rounded">
      <div className="grid grid-cols-10">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell key={`${rowIndex}-${colIndex}`} type={cell} />
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;

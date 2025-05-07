
import React from 'react';
import { Tetromino } from '../game/types';

interface NextPieceProps {
  piece: Tetromino | null;
}

const NextPiece: React.FC<NextPieceProps> = ({ piece }) => {
  if (!piece) return null;
  
  const { type, shape } = piece;
  
  return (
    <div className="bg-gray-800 p-3 rounded border border-gray-700">
      <h3 className="text-white text-center mb-2 font-bold">Next</h3>
      <div className="flex justify-center">
        <div className="grid grid-cols-4">
          {shape.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-4 h-4 ${
                  cell
                    ? `bg-tetromino-${type.toLowerCase()}`
                    : 'bg-transparent'
                }`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NextPiece;

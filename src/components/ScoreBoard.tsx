
import React from 'react';

interface ScoreBoardProps {
  score: number;
  level: number;
  linesCleared: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, level, linesCleared }) => {
  return (
    <div className="bg-gray-800 p-3 rounded border border-gray-700 text-white">
      <div className="mb-2">
        <h3 className="text-sm font-medium uppercase text-gray-400">Score</h3>
        <p className="text-xl font-bold">{score}</p>
      </div>
      
      <div className="mb-2">
        <h3 className="text-sm font-medium uppercase text-gray-400">Level</h3>
        <p className="text-xl font-bold">{level}</p>
      </div>
      
      <div>
        <h3 className="text-sm font-medium uppercase text-gray-400">Lines</h3>
        <p className="text-xl font-bold">{linesCleared}</p>
      </div>
    </div>
  );
};

export default ScoreBoard;

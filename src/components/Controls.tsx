
import React from 'react';
import { Button } from '@/components/ui/button';
import { GameAction } from '../game/types';
import { ArrowLeft, ArrowRight, ArrowDown, RotateCw, Play, Pause, RefreshCw } from 'lucide-react';

interface ControlsProps {
  dispatch: (action: GameAction) => void;
  isPaused: boolean;
  isGameOver: boolean;
}

const Controls: React.FC<ControlsProps> = ({ dispatch, isPaused, isGameOver }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2">
        <Button 
          variant="outline" 
          onClick={() => dispatch(GameAction.LEFT)}
          className="aspect-square"
          disabled={isGameOver}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <Button 
          variant="outline" 
          onClick={() => dispatch(GameAction.DOWN)}
          className="aspect-square"
          disabled={isGameOver}
        >
          <ArrowDown className="h-6 w-6" />
        </Button>
        <Button 
          variant="outline" 
          onClick={() => dispatch(GameAction.RIGHT)}
          className="aspect-square"
          disabled={isGameOver}
        >
          <ArrowRight className="h-6 w-6" />
        </Button>
      </div>
      
      <Button 
        variant="outline" 
        onClick={() => dispatch(GameAction.ROTATE)}
        disabled={isGameOver}
      >
        <RotateCw className="mr-2 h-4 w-4" />
        Rotate
      </Button>
      
      <Button 
        variant="outline" 
        onClick={() => dispatch(GameAction.HARD_DROP)}
        disabled={isGameOver}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        Drop
      </Button>
      
      <div className="grid grid-cols-2 gap-2 mt-4">
        <Button 
          variant={isPaused ? "default" : "outline"}
          onClick={() => dispatch(GameAction.PAUSE)}
          disabled={isGameOver}
        >
          {isPaused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
          {isPaused ? 'Resume' : 'Pause'}
        </Button>
        
        <Button 
          variant="destructive" 
          onClick={() => dispatch(GameAction.RESTART)}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default Controls;

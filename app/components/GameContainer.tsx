// components/GameContainer.tsx
import { useState } from 'react';
import { Card } from './Card';
import { StoryText } from './StoryText';
import { useStoryProgress } from '../hooks/useStoryProgress';

export const GameContainer = () => {
  const { 
    currentStage, 
    makeChoice, 
    isGameOver,
    earnedBadge 
  } = useStoryProgress();

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <StoryText text={currentStage.narrative} />
        
        {!isGameOver ? (
          <div className="flex justify-center gap-8 mt-8">
            {currentStage.choices.map((choice) => (
              <Card
                key={choice.nextStageId}
                choice={choice}
                onSelect={() => makeChoice(choice)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center mt-8">
            <h2 className="text-2xl text-white">Story Complete!</h2>
            {earnedBadge && (
              <div className="mt-4">
                <h3>You earned a new badge:</h3>
                <img src={earnedBadge.image} alt={earnedBadge.name} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// hooks/useStoryProgress.ts
import { useState, useEffect } from 'react';
import { StoryStage, Badge } from '../types/story';
import { generateStoryContent } from '../services/llmService';

export const useStoryProgress = () => {
  const [currentStage, setCurrentStage] = useState<StoryStage | null>(null);
  const [playerChoices, setPlayerChoices] = useState<string[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState<Badge | null>(null);

  useEffect(() => {
    initializeStory();
  }, []);

  const initializeStory = async () => {
    const initialStage = await generateStoryContent(
      'world-context',
      'initial',
      []
    );
    setCurrentStage(initialStage);
  };

  const makeChoice = async (choice: StoryChoice) => {
    const newChoices = [...playerChoices, choice.nextStageId];
    setPlayerChoices(newChoices);

    if (choice.nextStageId === 'ending') {
      setIsGameOver(true);
      // Calculate and set earned badge
      return;
    }

    const nextStage = await generateStoryContent(
      'world-context',
      choice.nextStageId,
      newChoices
    );
    setCurrentStage(nextStage);
  };

  return {
    currentStage,
    makeChoice,
    isGameOver,
    earnedBadge,
  };
};

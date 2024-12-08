'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, Choice, Badge, StoryStage } from '../types/game';
import { generateStoryContent } from '../services/gemini';

const initialStage: StoryStage = {
  id: 'start',
  narrative: 'You find yourself in a mysterious world, where your choices will shape your destiny...',
  choices: [
    {
      id: 'explore',
      text: 'Explore the surroundings carefully and gather information',
      personality: 'INTJ',
      nextStageId: 'forest'
    },
    {
      id: 'adventure',
      text: 'Boldly venture forth into the unknown',
      personality: 'ENFP',
      nextStageId: 'mountain'
    }
  ]
};

interface GameContextType {
  state: GameState;
  makeChoice: (choice: Choice) => Promise<void>;
  startNewGame: () => void;
  unlockBadge: (badge: Badge) => void;
}

const initialState: GameState = {
  currentStage: initialStage,
  collectedBadges: [],
  storyHistory: [],
};

type GameAction =
  | { type: 'MAKE_CHOICE'; payload: Choice }
  | { type: 'START_NEW_GAME' }
  | { type: 'SET_STAGE'; payload: StoryStage }
  | { type: 'UNLOCK_BADGE'; payload: Badge };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'MAKE_CHOICE':
      return {
        ...state,
        storyHistory: [
          ...state.storyHistory,
          {
            stageId: state.currentStage?.id || '',
            choiceId: action.payload.id,
            personality: action.payload.personality,
          },
        ],
      };
    case 'START_NEW_GAME':
      return initialState;
    case 'SET_STAGE':
      return {
        ...state,
        currentStage: action.payload,
      };
    case 'UNLOCK_BADGE':
      if (state.collectedBadges.some(badge => badge.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        collectedBadges: [...state.collectedBadges, action.payload],
      };
    default:
      return state;
  }
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const makeChoice = async (choice: Choice) => {
    dispatch({ type: 'MAKE_CHOICE', payload: choice });

    try {
      const storyContent = await generateStoryContent({
        currentStage: choice.nextStageId,
        choiceMade: choice.text,
        personality: choice.personality,
        storyHistory: state.storyHistory.map(h => h.stageId)
      });

      const nextStage: StoryStage = {
        id: choice.nextStageId,
        narrative: storyContent.narrative,
        choices: storyContent.choices.map((c, index) => ({
          ...c,
          id: `${choice.nextStageId}_${index}`
        }))
      };

      dispatch({ type: 'SET_STAGE', payload: nextStage });
    } catch (error) {
      console.error('Failed to generate next story stage:', error);
    }
  };

  const startNewGame = () => {
    dispatch({ type: 'START_NEW_GAME' });
  };

  const unlockBadge = (badge: Badge) => {
    dispatch({ type: 'UNLOCK_BADGE', payload: badge });
  };

  return (
    <GameContext.Provider value={{ state, makeChoice, startNewGame, unlockBadge }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
} 
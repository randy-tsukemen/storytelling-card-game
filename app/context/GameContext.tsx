'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, Choice, Badge, StoryStage, PersonalityType } from '../types/game';
import { generateStoryContent } from '../services/gemini';

const initialStage: StoryStage = {
  id: 'start',
  narrative: '在這個神秘的世界中，你即將開始一段與女帝的命運糾纏。每一個選擇都將影響故事的走向，也將決定你們之間的羈絆...',
  worldType: 'DYNASTY',
  simulationType: 'FIRST',
  choices: [
    {
      id: 'protect',
      text: '以護衛的身份守護女帝，暗中調查真相',
      personality: 'ISTJ',
      nextStageId: 'palace_guard',
      consequences: ['你將成為女帝的貼身護衛，但也意味著要面對宮廷中的明爭暗鬥']
    },
    {
      id: 'investigate',
      text: '以諜報人員的身份潛入，探索背後的陰謀',
      personality: 'INTJ',
      nextStageId: 'secret_agent',
      consequences: ['你將能夠自由行動，但需要時刻提防被發現的風險']
    }
  ]
};

const initialState: GameState = {
  currentStage: initialStage,
  collectedBadges: [],
  storyHistory: [],
  currentWorld: 'DYNASTY',
  currentSimulation: 'FIRST',
  emotionStats: {
    trust: 50,
    bond: 50
  },
  unlockedMemories: []
};

interface GameContextType {
  state: GameState;
  makeChoice: (choice: Choice) => Promise<void>;
  startNewGame: () => void;
  unlockBadge: (badge: Badge) => void;
  unlockMemory: (memoryId: string) => void;
}

type GameAction =
  | { type: 'MAKE_CHOICE'; payload: Choice }
  | { type: 'START_NEW_GAME' }
  | { type: 'SET_STAGE'; payload: StoryStage }
  | { type: 'UNLOCK_BADGE'; payload: Badge }
  | { type: 'UPDATE_EMOTIONS'; payload: { trust: number; bond: number } }
  | { type: 'UNLOCK_MEMORY'; payload: string }
  | { type: 'SET_WORLD'; payload: WorldType }
  | { type: 'SET_SIMULATION'; payload: SimulationType };

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
            worldType: state.currentWorld,
            simulationType: state.currentSimulation
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
    case 'UPDATE_EMOTIONS':
      return {
        ...state,
        emotionStats: {
          trust: Math.max(0, Math.min(100, state.emotionStats.trust + action.payload.trust)),
          bond: Math.max(0, Math.min(100, state.emotionStats.bond + action.payload.bond))
        }
      };
    case 'UNLOCK_MEMORY':
      if (state.unlockedMemories.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        unlockedMemories: [...state.unlockedMemories, action.payload]
      };
    case 'SET_WORLD':
      return {
        ...state,
        currentWorld: action.payload
      };
    case 'SET_SIMULATION':
      return {
        ...state,
        currentSimulation: action.payload
      };
    default:
      return state;
  }
};

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GeneratedChoice {
  text: string;
  personality: PersonalityType;
  nextStageId: string;
  consequences?: string[];
}

interface StoryResponse {
  narrative: string;
  choices: GeneratedChoice[];
  emotionImpact: {
    trust: number;
    bond: number;
  };
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const makeChoice = async (choice: Choice) => {
    dispatch({ type: 'MAKE_CHOICE', payload: choice });

    try {
      const storyContent = await generateStoryContent({
        currentStage: choice.nextStageId,
        choiceMade: choice.text,
        personality: choice.personality,
        storyHistory: state.storyHistory.map(h => h.stageId),
        worldType: state.currentWorld,
        simulationType: state.currentSimulation,
        emotionStats: state.emotionStats
      });

      const nextStage: StoryStage = {
        id: choice.nextStageId,
        narrative: storyContent.narrative,
        choices: storyContent.choices.map((c: GeneratedChoice, index: number) => ({
          ...c,
          id: `${choice.nextStageId}_${index}`
        })),
        worldType: state.currentWorld,
        simulationType: state.currentSimulation,
        emotionImpact: storyContent.emotionImpact
      };

      if (storyContent.emotionImpact) {
        dispatch({ 
          type: 'UPDATE_EMOTIONS', 
          payload: storyContent.emotionImpact 
        });
      }

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

  const unlockMemory = (memoryId: string) => {
    dispatch({ type: 'UNLOCK_MEMORY', payload: memoryId });
  };

  return (
    <GameContext.Provider value={{ 
      state, 
      makeChoice, 
      startNewGame, 
      unlockBadge,
      unlockMemory
    }}>
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
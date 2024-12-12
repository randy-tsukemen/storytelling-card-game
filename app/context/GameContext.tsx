'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, Choice, Badge, StoryStage, PersonalityType, StoryHistoryEntry, ChapterProgress, WorldType, SimulationType } from '../types/game';
import { generateStoryContent } from '../services/gemini';
import { getNovelContent, getChapterTitle } from '../services/novelService';

const initialChapterProgress: ChapterProgress = {
  currentChapter: 1,
  totalChapters: 8,
  choicesInChapter: 0,
  requiredChoices: 2
};

const initialStage: StoryStage = {
  id: 'start',
  narrative: '一陣頭暈目眩後，你發現自己來到了一個陌生的世界。眼前是金碧輝煌的宮殿，空氣中瀰漫著一股神秘的氣息。你知道，這裡是一個架空的古代王朝，而你即將與這個王朝的女帝產生不解之緣...',
  worldType: 'DYNASTY',
  simulationType: 'FIRST',
  chapterTitle: '序章：穿越初始',
  choices: [
    {
      id: 'guard',
      text: '參加禁衛選拔，以武藝出眾的表現進入宮廷',
      personality: 'ISTJ',
      nextStageId: 'palace_guard',
      consequences: ['你將有機會近距離保護女帝，但需要面對宮廷中的明爭暗鬥']
    },
    {
      id: 'scholar',
      text: '通過科舉考試，以才學見長的形象進入朝廷',
      personality: 'INTJ',
      nextStageId: 'court_scholar',
      consequences: ['你能夠參與朝政，接觸到更多機密信息，但也要應對各方勢力的試探']
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
  unlockedMemories: [],
  chapterProgress: initialChapterProgress
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
  | { type: 'SET_SIMULATION'; payload: SimulationType }
  | { type: 'ADVANCE_CHAPTER' };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'MAKE_CHOICE': {
      const newChoicesInChapter = state.chapterProgress.choicesInChapter + 1;
      const shouldAdvanceChapter = newChoicesInChapter >= state.chapterProgress.requiredChoices;

      return {
        ...state,
        storyHistory: [
          ...state.storyHistory,
          {
            stageId: state.currentStage?.id || '',
            choiceId: action.payload.id,
            choiceText: action.payload.text,
            narrative: state.currentStage?.narrative || '',
            consequence: action.payload.consequences?.[0] || '',
            personality: action.payload.personality,
            worldType: state.currentWorld,
            simulationType: state.currentSimulation,
            chapterTitle: state.currentStage?.chapterTitle
          },
        ],
        chapterProgress: {
          ...state.chapterProgress,
          choicesInChapter: shouldAdvanceChapter ? 0 : newChoicesInChapter,
          currentChapter: shouldAdvanceChapter 
            ? Math.min(state.chapterProgress.currentChapter + 1, state.chapterProgress.totalChapters)
            : state.chapterProgress.currentChapter
        }
      };
    }
    case 'ADVANCE_CHAPTER':
      return {
        ...state,
        chapterProgress: {
          ...state.chapterProgress,
          currentChapter: state.chapterProgress.currentChapter + 1,
          choicesInChapter: 0
        }
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
      // Get novel content based on current progress
      const novelContent = getNovelContent(state.chapterProgress);
      
      // Generate AI response for the choice consequences
      const storyContent = await generateStoryContent({
        currentStage: choice.nextStageId,
        choiceMade: choice.text,
        personality: choice.personality,
        storyHistory: state.storyHistory.map(h => h.stageId),
        worldType: state.currentWorld,
        simulationType: state.currentSimulation,
        emotionStats: state.emotionStats,
        chapterProgress: state.chapterProgress
      });

      // Combine novel content with AI-generated consequences
      const nextStage: StoryStage = {
        id: choice.nextStageId,
        narrative: novelContent.currentContent.join('\n'),
        choices: novelContent.availableChoices.map((c, index) => ({
          id: `${choice.nextStageId}_${index}`,
          text: c.text,
          personality: choice.personality,
          nextStageId: `${state.chapterProgress.currentChapter}_${state.chapterProgress.choicesInChapter + 1}_${index}`,
          consequences: c.consequences
        })),
        worldType: state.currentWorld,
        simulationType: state.currentSimulation,
        emotionImpact: storyContent.emotionImpact,
        chapterTitle: getChapterTitle(state.chapterProgress.currentChapter)
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
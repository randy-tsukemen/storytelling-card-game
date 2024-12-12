export type PersonalityType = 
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export type WorldType = 'DYNASTY' | 'FOUNDATION';
export type SimulationType = 'FIRST' | 'SECOND' | 'THIRD';

export interface ChapterProgress {
  currentChapter: number;
  totalChapters: number;
  choicesInChapter: number;
  requiredChoices: number;
}

export interface Choice {
  id: string;
  text: string;
  personality: PersonalityType;
  nextStageId: string;
  consequences?: string[];
  isChapterEnd?: boolean;
}

export interface StoryStage {
  id: string;
  narrative: string;
  choices: Choice[];
  isEnding?: boolean;
  worldType: WorldType;
  simulationType: SimulationType;
  emotionImpact?: {
    trust: number;
    bond: number;
  };
  chapterTitle?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  personality: PersonalityType;
  imageUrl: string;
  isUnlocked: boolean;
  worldType: WorldType;
  simulationType: SimulationType;
}

export interface StoryHistoryEntry {
  stageId: string;
  choiceId: string;
  choiceText: string;
  narrative: string;
  consequence: string;
  personality: PersonalityType;
  worldType: WorldType;
  simulationType: SimulationType;
  chapterTitle?: string;
}

export interface GameState {
  currentStage: StoryStage | null;
  collectedBadges: Badge[];
  storyHistory: StoryHistoryEntry[];
  currentWorld: WorldType;
  currentSimulation: SimulationType;
  emotionStats: {
    trust: number;
    bond: number;
  };
  unlockedMemories: string[];
  chapterProgress: ChapterProgress;
} 
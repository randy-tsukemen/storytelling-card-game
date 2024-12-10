export type PersonalityType = 
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export type WorldType = 'DYNASTY' | 'FOUNDATION';
export type SimulationType = 'FIRST' | 'SECOND' | 'THIRD';

export interface Choice {
  id: string;
  text: string;
  personality: PersonalityType;
  nextStageId: string;
  consequences?: string[];
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

export interface GameState {
  currentStage: StoryStage | null;
  collectedBadges: Badge[];
  storyHistory: {
    stageId: string;
    choiceId: string;
    personality: PersonalityType;
    worldType: WorldType;
    simulationType: SimulationType;
  }[];
  currentWorld: WorldType;
  currentSimulation: SimulationType;
  emotionStats: {
    trust: number;
    bond: number;
  };
  unlockedMemories: string[];
} 
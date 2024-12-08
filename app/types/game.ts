export type PersonalityType = 
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export interface Choice {
  id: string;
  text: string;
  personality: PersonalityType;
  nextStageId: string;
}

export interface StoryStage {
  id: string;
  narrative: string;
  choices: Choice[];
  isEnding?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  personality: PersonalityType;
  imageUrl: string;
  isUnlocked: boolean;
}

export interface GameState {
  currentStage: StoryStage | null;
  collectedBadges: Badge[];
  storyHistory: {
    stageId: string;
    choiceId: string;
    personality: PersonalityType;
  }[];
} 
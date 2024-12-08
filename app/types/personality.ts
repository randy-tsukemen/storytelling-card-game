// types/personality.ts
export type PersonalityType = {
  id: number;
  name: string;
  description: string;
  traits: string[];
};

// types/story.ts
export type StoryChoice = {
  text: string;
  personality: PersonalityType;
  nextStageId: string;
};

export type StoryStage = {
  id: string;
  narrative: string;
  choices: StoryChoice[];
  isEnding: boolean;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  image: string;
  isUnlocked: boolean;
};

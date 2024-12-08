import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

interface StoryPrompt {
  currentStage: string;
  choiceMade?: string;
  personality?: string;
  storyHistory?: string[];
}

export async function generateStoryContent({ currentStage, choiceMade, personality, storyHistory = [] }: StoryPrompt) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
    You are a creative storyteller crafting an interactive fantasy adventure.
    Current stage: ${currentStage}
    ${choiceMade ? `Player chose: ${choiceMade}` : ''}
    ${personality ? `Player's shown personality trait: ${personality}` : ''}
    Story history: ${storyHistory.join(' -> ')}

    Generate a story continuation with:
    1. A rich, engaging narrative paragraph (max 3 sentences)
    2. Two distinct choices that reflect different personality types
    3. Each choice should lead to a different potential story branch

    Format the response as JSON:
    {
      "narrative": "story text",
      "choices": [
        {
          "text": "first choice description",
          "personality": "one of the 16 MBTI types",
          "nextStageId": "unique_id"
        },
        {
          "text": "second choice description",
          "personality": "different MBTI type",
          "nextStageId": "unique_id"
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating story content:', error);
    throw error;
  }
} 
import { GoogleGenerativeAI } from '@google/generative-ai';
import { WorldType, SimulationType } from '../types/game';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

interface StoryPrompt {
  currentStage: string;
  choiceMade?: string;
  personality?: string;
  storyHistory?: string[];
  worldType: WorldType;
  simulationType: SimulationType;
  emotionStats?: {
    trust: number;
    bond: number;
  };
}

const WORLD_CONTEXTS = {
  DYNASTY: {
    FIRST: `你正在扮演一個穿越到架空古代王朝的角色。在這個世界中，你發現自己與年輕的女帝有著命運般的聯繫。
第一次輪迴中，你需要在保護女帝的同時，調查圍繞在她身邊的陰謀。要小心，因為每個選擇都可能影響女帝對你的信任。`,
    SECOND: `在第二次輪迴中，你帶著前世的記憶重生。這次你選擇了不同的身份和立場，試圖改變悲劇的結局。
但要記住，即使你知道未來，改變命運的代價可能比你想像的更大。`,
    THIRD: `這是最後的輪迴。你已經經歷了兩次失敗，這次你必須運用所有積累的知識和經驗。
女帝的命運就在你的手中，但要記住：有時候，真相比謊言更殘酷。`
  },
  FOUNDATION: {
    FIRST: '未使用',
    SECOND: '未使用',
    THIRD: '未使用'
  }
};

function cleanJsonResponse(text: string): string {
  // Remove any markdown code block indicators
  text = text.replace(/```json\n/g, '');
  text = text.replace(/```\n/g, '');
  text = text.replace(/```/g, '');
  
  // Remove any leading/trailing whitespace
  text = text.trim();
  
  // If the response starts with a newline and {, remove everything before {
  if (text.includes('{\n')) {
    text = text.substring(text.indexOf('{'));
  }
  
  return text;
}

export async function generateStoryContent({ 
  currentStage, 
  choiceMade, 
  personality, 
  storyHistory = [],
  worldType,
  simulationType,
  emotionStats
}: StoryPrompt) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const worldContext = WORLD_CONTEXTS[worldType][simulationType];
  const emotionalContext = emotionStats 
    ? `當前關係狀態：女帝對你的信任度 ${emotionStats.trust}/100，情感羈絆 ${emotionStats.bond}/100。`
    : '';

  const prompt = `你是一個互動故事遊戲的生成器，正在創作一個關於玩家與女帝命運糾纏的故事。
${worldContext}

當前階段：${currentStage}
${choiceMade ? `玩家選擇：${choiceMade}` : ''}
${personality ? `玩家表現出的性格特徵：${personality}` : ''}
${emotionalContext}
故事歷程：${storyHistory.join(' -> ')}

請生成一段故事情節，要求：
1. 描述要富有張力和情感，展現宮廷中的權謀與人性
2. 選項要反映不同的處事方式，並暗示可能的後果
3. 故事要朝著預設的悲劇結局推進，但過程要引人入勝
4. 要考慮玩家之前的選擇和當前的信任度

請嚴格按照以下JSON格式回應，不要添加其他文字：
{
  "narrative": "2-3句故事描述",
  "choices": [
    {
      "text": "第一個選項描述",
      "personality": "對應的MBTI類型",
      "nextStageId": "唯一標識符",
      "consequences": ["可能的後果描述"]
    },
    {
      "text": "第二個選項描述",
      "personality": "不同的MBTI類型",
      "nextStageId": "唯一標識符",
      "consequences": ["可能的後果描述"]
    }
  ],
  "emotionImpact": {
    "trust": 10,
    "bond": -5
  }
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Clean and parse the response
    const cleanedText = cleanJsonResponse(text);
    
    try {
      const parsedResponse = JSON.parse(cleanedText);
      
      // Validate the response structure
      if (!parsedResponse.narrative || !Array.isArray(parsedResponse.choices) || parsedResponse.choices.length !== 2) {
        throw new Error('Invalid response structure');
      }
      
      return parsedResponse;
    } catch (error) {
      console.error('Failed to parse response:', cleanedText);
      throw new Error('Failed to parse story response');
    }
  } catch (error) {
    console.error('Error generating story content:', error);
    
    // Return a fallback response
    return {
      narrative: "故事仍在繼續，但前路未卜...",
      choices: [
        {
          text: "謹慎行事，靜觀其變",
          personality: "ISTJ",
          nextStageId: "fallback_1",
          consequences: ["繼續探索"]
        },
        {
          text: "尋找新的線索",
          personality: "INFP",
          nextStageId: "fallback_2",
          consequences: ["暫時休整"]
        }
      ],
      emotionImpact: {
        trust: 0,
        bond: 0
      }
    };
  }
} 
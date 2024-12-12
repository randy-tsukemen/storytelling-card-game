import { GoogleGenerativeAI } from '@google/generative-ai';
import { WorldType, SimulationType, ChapterProgress } from '../types/game';

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
  chapterProgress: ChapterProgress;
}

const CHAPTER_TITLES = {
  DYNASTY: {
    1: '序章：穿越初始',
    2: '第一章：宮廷試煉',
    3: '第二章：密謀與陰影',
    4: '第三章：權力遊戲',
    5: '第四章：真相浮現',
    6: '第五章：輪迴重生',
    7: '第六章：命運抉擇',
    8: '終章：最後一世'
  }
} as const;

const CHAPTER_THEMES = {
  DYNASTY: {
    1: '你意外穿越到這個世界，需要適應新的身份並接近女帝。',
    2: '你在宮中站穩腳跟，但發現女帝身邊暗藏危機。',
    3: '你發現了一個驚人的陰謀，必須在調查真相和保護女帝之間做出選擇。',
    4: '你捲入了複雜的權力鬥爭，每個選擇都可能影響女帝的信任。',
    5: '隨著調查深入，你逐漸接近真相，但代價可能比想像中更大。',
    6: '帶著前世的記憶重生，你試圖改變命運的走向。',
    7: '第二次輪迴失敗後，你明白了更多真相。',
    8: '最後的機會，你必須決定是否告訴女帝全部真相。'
  }
} as const;

const STORY_BACKGROUNDS = {
  DYNASTY: {
    FIRST: `你是一個穿越者，來到了一個架空的古代王朝。在這裡，你遇見了年輕的女帝，她美麗而威嚴，卻身陷危險的陰謀之中。
第一世中，你需要在保護女帝的同時，調查圍繞在她身邊的真相。要謹慎行事，因為每個選擇都可能影響女帝的命運。`,
    SECOND: `在第二次輪迴中，你帶著前世的記憶重生。這次你選擇了不同的方式接近女帝，試圖避免悲劇的發生。
但你發現，即使知道未來，要改變命運依然困難重重。女帝對你若即若離的態度，讓你更加困惑。`,
    THIRD: `這是最後的機會。經歷了兩次失敗，你終於明白了更多真相。
你知道女帝的結局，也知道那些不為人知的秘密。但最困難的選擇還在前方：是堅持保護她的單純，還是讓她面對殘酷的真實？`
  }
} as const;

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

  // Replace +number with just number
  text = text.replace(/:\s*\+(\d+)/g, ': $1');
  
  return text;
}

export async function generateStoryContent({ 
  currentStage, 
  choiceMade, 
  personality, 
  storyHistory = [],
  worldType,
  simulationType,
  emotionStats,
  chapterProgress
}: StoryPrompt) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const worldContext = STORY_BACKGROUNDS[worldType][simulationType];
  const emotionalContext = emotionStats 
    ? `當前關係狀態：女帝對你的信任度 ${emotionStats.trust}/100，情感羈絆 ${emotionStats.bond}/100。`
    : '';
  
  const currentChapterTitle = CHAPTER_TITLES[worldType][chapterProgress.currentChapter];
  const currentChapterTheme = CHAPTER_THEMES[worldType][chapterProgress.currentChapter];
  const chapterContext = `
當前章節：${currentChapterTitle}
章節主題：${currentChapterTheme}
進度：第 ${chapterProgress.choicesInChapter + 1}/${chapterProgress.requiredChoices} 幕`;

  const prompt = `你是一個互動故事遊戲的生成器，正在根據小說《人生模拟：我让女帝抱憾终身》改編故事。
${worldContext}

${chapterContext}
當前階段：${currentStage}
${choiceMade ? `玩家選擇：${choiceMade}` : ''}
${personality ? `玩家表現出的性格特徵：${personality}` : ''}
${emotionalContext}
故事歷程：${storyHistory.join(' -> ')}

請生成一段故事情節，要求：
1. 描述要符合當前章節主題，展現宮廷中的權謀與人性
2. 提供2-3個選項，每個選項都要反映不同的處事方式和性格特徵
3. 選項要影響女帝對玩家的信任度和情感羈絆
4. 故事要朝著預設的悲劇結局推進，但過程要引人入勝
5. 要考慮玩家之前的選擇，保持故事的連貫性

請嚴格按照以下JSON格式回應，不要添加其他文字，數字不要加+號：
{
  "narrative": "2-3句故事描述",
  "chapterTitle": "${currentChapterTitle}",
  "choices": [
    {
      "text": "選項描述",
      "personality": "對應的MBTI類型",
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
      if (!parsedResponse.narrative || 
          !Array.isArray(parsedResponse.choices) || 
          parsedResponse.choices.length < 2 || 
          parsedResponse.choices.length > 3) {
        throw new Error('Invalid response structure: narrative missing or invalid number of choices');
      }

      // Validate each choice has required fields
      for (const choice of parsedResponse.choices) {
        if (!choice.text || !choice.personality || !choice.nextStageId) {
          throw new Error('Invalid choice structure: missing required fields');
        }
      }

      // Ensure emotion impact values are numbers
      if (parsedResponse.emotionImpact) {
        parsedResponse.emotionImpact.trust = Number(parsedResponse.emotionImpact.trust);
        parsedResponse.emotionImpact.bond = Number(parsedResponse.emotionImpact.bond);
      }
      
      return parsedResponse;
    } catch (parseError) {
      console.error('Failed to parse response:', cleanedText);
      console.error('Parse error:', parseError);
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
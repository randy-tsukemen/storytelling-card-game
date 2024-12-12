import { ChapterProgress } from '../types/game';

interface NovelChapter {
  title: string;
  content: string[];
  choices: {
    text: string;
    consequences: string[];
  }[];
}

const NOVEL_CHAPTERS: NovelChapter[] = [
  {
    title: '序章：穿越初始',
    content: [
      '你意外穿越到這個世界，發現自己來到了一個陌生的王朝。',
      '眼前是金碧輝煌的宮殿，空氣中瀰漫著一股神秘的氣息。',
      '你知道，這裡是一個架空的古代王朝，而你即將與這個王朝的女帝產生不解之緣...'
    ],
    choices: [
      {
        text: '參加禁衛選拔，以武藝出眾的表現進入宮廷',
        consequences: ['你將有機會近距離保護女帝，但需要面對宮廷中的明爭暗鬥']
      },
      {
        text: '通過科舉考試，以才學見長的形象進入朝廷',
        consequences: ['你能夠參與朝政，接觸到更多機密信息，但也要應對各方勢力的試探']
      }
    ]
  },
  {
    title: '第一章：宮廷試煉',
    content: [
      '你成功進入宮廷，卻發現這裡暗流湧動。',
      '年輕���女帝武銀瑤端坐在龍椅上，美麗而威嚴，但你能感受到她身邊的危機。',
      '你必須在保護女帝的同時，調查圍繞在她身邊的真相。'
    ],
    choices: [
      {
        text: '暗中調查可疑的大臣',
        consequences: ['你發現了一些不尋常的蛛絲馬跡，但也引起了某些人的注意']
      },
      {
        text: '主動接近女帝，表達忠誠',
        consequences: ['女帝對你的表現印象深刻，但這也讓其他人對你產生了警惕']
      }
    ]
  },
  {
    title: '第二章：密謀與陰影',
    content: [
      '你漸漸發現，宮中暗藏著一個巨大的陰謀。',
      '女帝的親叔叔，鎮陽王武乾坤似乎在密謀著什麼。',
      '而女帝對你的態度，也變得越來越親近。'
    ],
    choices: [
      {
        text: '繼續深入調查鎮陽王',
        consequences: ['你發現了更多驚人的真相，但也讓自己處於危險之中']
      },
      {
        text: '與女帝結盟，共同應對危機',
        consequences: ['你們的關係更進一步，但這也加速了陰謀的爆發']
      }
    ]
  },
  {
    title: '第三章：權力遊戲',
    content: [
      '鎮陽王的陰謀逐漸浮出水面，他正在策劃一場政變。',
      '你必須在保護女帝和揭露真相之間做出選擇。',
      '每一步都可能影響整個王朝的命運。'
    ],
    choices: [
      {
        text: '集結力量，準備反擊',
        consequences: ['你開始召集可靠的力量，但時間所剩不多']
      },
      {
        text: '勸說女帝提前採取行動',
        consequences: ['這是一場冒險的賭注，成敗在此一舉']
      }
    ]
  },
  {
    title: '第四章：真相浮現',
    content: [
      '你終於知道了更多真相，鎮陽王不僅密謀造反，還與妖魔勾結。',
      '女帝對你的信任已經達到頂點，你們的感情也在不知不覺中加深。',
      '但你隱約感覺，事情並不像表面看起來那麼簡單。'
    ],
    choices: [
      {
        text: '向女帝坦白一切',
        consequences: ['這可能會動搖她的信任，但也許是避免悲劇的關鍵']
      },
      {
        text: '獨自承擔，保護女帝',
        consequences: ['你選擇獨自面對危險，但這可能導致更大的誤會']
      }
    ]
  },
  {
    title: '第五章：輪迴重生',
    content: [
      '你在睡夢中被女帝殺害，帶著前世的記憶重生。',
      '這一次，你決定用不同的方式接近女帝，試圖避免悲劇的發生。',
      '但你發現，即使知道未來，要改變命運依然困難重重。'
    ],
    choices: [
      {
        text: '嘗試阻止女帝接觸鎮陽王',
        consequences: ['你想要從源頭改變歷史，但這可能引發新的變數']
      },
      {
        text: '尋找其他盟友，建立新的勢力',
        consequences: ['你希望通過不同的路徑達成目標，但風險依然存在']
      }
    ]
  },
  {
    title: '第六章：命運抉擇',
    content: [
      '第二次輪迴失敗後，你帶著更多記憶和真相重生。',
      '你終於明白了整個陰謀的全貌，也知道了女帝的結局。',
      '這是最後的機會，你必須決定是否要告訴女帝全部真相。'
    ],
    choices: [
      {
        text: '揭露所有真相',
        consequences: ['這可能會徹底改變一切，但也可能導致更大的災難']
      },
      {
        text: '選擇犧牲自己',
        consequences: ['用自己的生命換取女帝的平安，但這可能不是最好的結局']
      }
    ]
  },
  {
    title: '終章：最後一世',
    content: [
      '一切都將在此終結。',
      '你的每一次選擇，都將決定這個故事的結局。',
      '是堅持保護她的單純，還是讓她面對殘酷的真實？'
    ],
    choices: [
      {
        text: '守護她的純真',
        consequences: ['你選擇獨自承擔一切，但這可能讓悲劇再次重演']
      },
      {
        text: '讓她直面真相',
        consequences: ['這是一個殘酷的選擇，但也許能夠真正改變命運']
      }
    ]
  }
];

export function getNovelContent(chapterProgress: ChapterProgress): {
  currentContent: string[];
  availableChoices: {
    text: string;
    consequences: string[];
  }[];
} {
  const chapter = NOVEL_CHAPTERS[chapterProgress.currentChapter - 1];
  if (!chapter) {
    return {
      currentContent: ['故事已經結束...'],
      availableChoices: []
    };
  }

  const startIndex = chapterProgress.choicesInChapter * 2;
  const endIndex = startIndex + 2;
  
  return {
    currentContent: chapter.content.slice(startIndex, endIndex),
    availableChoices: chapter.choices
  };
}

export function getChapterTitle(chapterNumber: number): string {
  const chapter = NOVEL_CHAPTERS[chapterNumber - 1];
  return chapter?.title || '未知章節';
}

export function getTotalChapters(): number {
  return NOVEL_CHAPTERS.length;
} 
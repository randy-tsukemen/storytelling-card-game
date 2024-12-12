'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { Choice } from '../types/game';
import ChoiceCard from './ChoiceCard';
import EmotionalStats from './EmotionalStats';
import StoryRecord from './StoryRecord';

interface ChoiceResult {
  choice: string;
  consequence: string;
}

const StoryMotionDiv = motion.div;

export default function StoryGame() {
  const { state, makeChoice } = useGame();
  const { currentStage, storyHistory, chapterProgress } = state;
  const [choiceResult, setChoiceResult] = useState<ChoiceResult | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleChoice = async (choice: Choice) => {
    setChoiceResult({
      choice: choice.text,
      consequence: choice.consequences?.[0] || '故事仍在繼續...'
    });
    
    setIsTransitioning(true);
    
    setTimeout(async () => {
      await makeChoice(choice);
      setChoiceResult(null);
      setIsTransitioning(false);
    }, 3000);
  };

  const getChoicesGridClass = (choicesCount: number) => {
    switch (choicesCount) {
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-3';
      default:
        return 'grid-cols-1 md:grid-cols-2';
    }
  };

  if (!currentStage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">載入故事中...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  {currentStage.chapterTitle || `第${chapterProgress.currentChapter}章`}
                </h2>
                <div className="text-sm text-gray-500">
                  第 {chapterProgress.choicesInChapter + 1} / {chapterProgress.requiredChoices} 幕
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div
                  className="bg-purple-600 h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${(chapterProgress.choicesInChapter / chapterProgress.requiredChoices) * 100}%`
                  }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {choiceResult ? (
                <StoryMotionDiv
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-purple-100 rounded-2xl shadow-xl p-8 mb-8"
                >
                  <div className="prose prose-purple max-w-none">
                    <h3 className="text-xl font-bold text-purple-800 mb-4">
                      你選擇了...
                    </h3>
                    <p className="text-purple-900 mb-6 text-lg">
                      {choiceResult.choice}
                    </p>
                    <div className="border-t border-purple-200 pt-4">
                      <p className="text-purple-800 italic">
                        {choiceResult.consequence}
                      </p>
                    </div>
                  </div>
                </StoryMotionDiv>
              ) : (
                <StoryMotionDiv
                  key="narrative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl shadow-xl p-8 mb-8"
                >
                  <div className="prose max-w-none">
                    <p className="text-xl text-gray-800 leading-relaxed mb-8 whitespace-pre-line">
                      {currentStage.narrative.split('\n').map((paragraph, index) => (
                        <React.Fragment key={index}>
                          {paragraph}
                          <br />
                          <br />
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                </StoryMotionDiv>
              )}
            </AnimatePresence>

            <div className={`grid gap-6 ${getChoicesGridClass(currentStage.choices.length)}`}>
              {!isTransitioning && currentStage.choices.map((choice, index) => (
                <ChoiceCard
                  key={choice.id}
                  choice={choice}
                  onSelect={handleChoice}
                  index={index}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <EmotionalStats />
            <StoryRecord />
          </div>
        </div>
      </div>
    </div>
  );
} 
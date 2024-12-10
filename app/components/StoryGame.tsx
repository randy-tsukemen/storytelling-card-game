'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { Choice } from '../types/game';
import ChoiceCard from './ChoiceCard';
import EmotionalStats from './EmotionalStats';
import StoryRecord from './StoryRecord';

interface ChoiceResult {
  choice: string;
  consequence: string;
}

const MotionDiv = motion.div;

export default function StoryGame() {
  const { state, makeChoice } = useGame();
  const { currentStage } = state;
  const [choiceResult, setChoiceResult] = useState<ChoiceResult | null>(null);
  const [choiceCount, setChoiceCount] = useState(0);

  const handleChoice = async (choice: Choice) => {
    setChoiceResult({
      choice: choice.text,
      consequence: choice.consequences?.[0] || 'The story continues...'
    });
    
    setChoiceCount(prev => prev + 1);
    
    // Wait for 2 seconds to show the consequence
    setTimeout(async () => {
      await makeChoice(choice);
      setChoiceResult(null);
    }, 2000);
  };

  if (!currentStage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Loading Story...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <AnimatePresence mode="wait">
              {choiceResult ? (
                <MotionDiv
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-purple-100 rounded-2xl shadow-xl p-8 mb-8"
                >
                  <h3 className="text-xl font-bold text-purple-800 mb-2">
                    Your Choice
                  </h3>
                  <p className="text-purple-900 mb-4">{choiceResult.choice}</p>
                  <h3 className="text-xl font-bold text-purple-800 mb-2">
                    Consequence
                  </h3>
                  <p className="text-purple-900">{choiceResult.consequence}</p>
                </MotionDiv>
              ) : (
                <MotionDiv
                  key="narrative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl shadow-xl p-8 mb-8"
                >
                  <div className="mb-4 text-sm text-gray-500">
                    Choice {choiceCount + 1} of 15
                  </div>
                  <p className="text-xl text-gray-800 leading-relaxed mb-8">
                    {currentStage.narrative}
                  </p>
                </MotionDiv>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {!choiceResult && currentStage.choices.map((choice, index) => (
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
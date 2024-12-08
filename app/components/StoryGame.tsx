'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import ChoiceCard from './ChoiceCard';

export default function StoryGame() {
  const { state, makeChoice } = useGame();
  const { currentStage } = state;

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
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <p className="text-xl text-gray-800 leading-relaxed mb-8">
              {currentStage.narrative}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentStage.choices.map((choice, index) => (
            <ChoiceCard
              key={choice.id}
              choice={choice}
              onSelect={makeChoice}
              index={index}
            />
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Story Progress
          </h2>
          <div className="flex space-x-2">
            {state.storyHistory.map((history, index) => (
              <div
                key={index}
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: `hsl(${
                    (index * 360) / state.storyHistory.length
                  }, 70%, 50%)`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
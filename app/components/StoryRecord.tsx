'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

const RecordMotionDiv = motion.div;

export default function StoryRecord() {
  const { state } = useGame();
  const { storyHistory, currentWorld, currentSimulation } = state;

  const getSimulationName = (sim: string) => {
    switch (sim) {
      case 'FIRST': return '第一世';
      case 'SECOND': return '第二世';
      case 'THIRD': return '最終世';
      default: return sim;
    }
  };

  const getWorldName = (world: string) => {
    return world === 'DYNASTY' ? '女帝的宮廷' : '未知';
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { x: -20, opacity: 0 },
    show: { x: 0, opacity: 1 }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">故事回顧</h2>
      <div className="mb-4">
        <span className="text-lg font-semibold text-purple-600">
          {getWorldName(currentWorld)} - {getSimulationName(currentSimulation)}
        </span>
      </div>
      <RecordMotionDiv
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {storyHistory.map((record, index) => (
          <RecordMotionDiv
            key={index}
            variants={item}
            className="border-l-4 border-blue-500 pl-4 py-2"
          >
            <div className="text-sm text-gray-500 mb-2">
              第 {index + 1} 幕
            </div>
            {record.narrative && (
              <div className="text-gray-800 mb-3 text-base">
                {record.narrative}
              </div>
            )}
            <div className="text-sm text-purple-600 font-medium mb-2">
              你的選擇：{record.choiceText}
            </div>
            {record.consequence && (
              <div className="text-sm text-gray-600 italic">
                結果：{record.consequence}
              </div>
            )}
          </RecordMotionDiv>
        ))}
      </RecordMotionDiv>
    </div>
  );
} 
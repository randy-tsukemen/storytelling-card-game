'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

const StatMotionDiv = motion.div;

export default function EmotionalStats() {
  const { state } = useGame();
  const { emotionStats, currentWorld } = state;

  const getEmotionColor = (value: number) => {
    if (value >= 75) return 'bg-green-500';
    if (value >= 50) return 'bg-blue-500';
    if (value >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const characterName = currentWorld === 'DYNASTY' ? '女帝' : '未知';

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">與{characterName}的羈絆</h2>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">信任度</span>
            <span className="text-sm font-medium">{emotionStats.trust}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <StatMotionDiv
              className={`h-2.5 rounded-full ${getEmotionColor(emotionStats.trust)}`}
              initial={{ width: 0 }}
              animate={{ width: `${emotionStats.trust}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">情感羈絆</span>
            <span className="text-sm font-medium">{emotionStats.bond}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <StatMotionDiv
              className={`h-2.5 rounded-full ${getEmotionColor(emotionStats.bond)}`}
              initial={{ width: 0 }}
              animate={{ width: `${emotionStats.bond}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 
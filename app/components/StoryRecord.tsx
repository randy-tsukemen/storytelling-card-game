'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

const MotionDiv = motion.div;

export default function StoryRecord() {
  const { state } = useGame();
  const { storyHistory, currentWorld, currentSimulation } = state;

  const getSimulationName = (sim: string) => {
    switch (sim) {
      case 'FIRST': return 'First Simulation';
      case 'SECOND': return 'Second Simulation';
      case 'THIRD': return 'Final Simulation';
      default: return sim;
    }
  };

  const getWorldName = (world: string) => {
    return world === 'DYNASTY' ? 'Demon-Ravaged Dynasty' : 'Foundation Containment';
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
      <h2 className="text-2xl font-bold mb-6">Your Story So Far</h2>
      <div className="mb-4">
        <span className="text-lg font-semibold text-purple-600">
          {getWorldName(currentWorld)} - {getSimulationName(currentSimulation)}
        </span>
      </div>
      <MotionDiv
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {storyHistory.map((record, index) => (
          <MotionDiv
            key={index}
            variants={item}
            className="border-l-4 border-blue-500 pl-4 py-2"
          >
            <div className="text-sm text-gray-500 mb-1">
              Choice {index + 1} - {record.personality}
            </div>
            <div className="text-gray-800">
              Stage: {record.stageId}
            </div>
          </MotionDiv>
        ))}
      </MotionDiv>
    </div>
  );
} 
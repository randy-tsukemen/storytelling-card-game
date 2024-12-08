'use client';

import React from 'react';
import { Choice } from '../types/game';
import { motion } from 'framer-motion';

interface ChoiceCardProps {
  choice: Choice;
  onSelect: (choice: Choice) => void;
  index: number;
}

export default function ChoiceCard({ choice, onSelect, index }: ChoiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative cursor-pointer bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
      onClick={() => onSelect(choice)}
    >
      <div className="p-6">
        <div className="absolute top-3 right-3 text-xs font-mono text-gray-500">
          {choice.personality}
        </div>
        <div className="text-lg font-medium text-gray-900 mb-2">
          {choice.text}
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
      </div>
    </motion.div>
  );
} 
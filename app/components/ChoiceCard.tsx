'use client';

import { motion } from 'framer-motion';
import { Choice } from '../types/game';

interface ChoiceCardProps {
  choice: Choice;
  onSelect: (choice: Choice) => void;
  index: number;
}

const ChoiceMotionDiv = motion.div;

export default function ChoiceCard({ choice, onSelect, index }: ChoiceCardProps) {
  const getPersonalityColor = (personality: string) => {
    switch (personality) {
      case 'ISTJ':
      case 'ISFJ':
      case 'INFJ':
      case 'INTJ':
        return 'border-blue-500 hover:bg-blue-50';
      case 'ISTP':
      case 'ISFP':
      case 'INFP':
      case 'INTP':
        return 'border-green-500 hover:bg-green-50';
      case 'ESTP':
      case 'ESFP':
      case 'ENFP':
      case 'ENTP':
        return 'border-yellow-500 hover:bg-yellow-50';
      case 'ESTJ':
      case 'ESFJ':
      case 'ENFJ':
      case 'ENTJ':
        return 'border-red-500 hover:bg-red-50';
      default:
        return 'border-gray-500 hover:bg-gray-50';
    }
  };

  return (
    <ChoiceMotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`cursor-pointer rounded-xl shadow-lg overflow-hidden border-l-4 ${getPersonalityColor(choice.personality)}`}
      onClick={() => onSelect(choice)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-6 bg-white">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          {choice.text}
        </h3>
        {choice.consequences && choice.consequences.length > 0 && (
          <p className="text-sm text-gray-600 italic">
            可能的結果：{choice.consequences[0]}
          </p>
        )}
        <div className="mt-4 text-xs text-gray-500">
          性格傾向：{choice.personality}
        </div>
      </div>
    </ChoiceMotionDiv>
  );
} 
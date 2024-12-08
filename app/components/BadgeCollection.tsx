'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { Badge } from '../types/game';
import Image from 'next/image';

const BadgeCard = ({ badge }: { badge: Badge }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.05 }}
    className={`relative p-4 rounded-lg ${
      badge.isUnlocked
        ? 'bg-white shadow-lg'
        : 'bg-gray-200 opacity-50'
    }`}
  >
    <div className="w-24 h-24 mx-auto mb-3">
      {badge.isUnlocked ? (
        <Image
          src={badge.imageUrl}
          alt={badge.name}
          width={96}
          height={96}
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-300 rounded-full">
          <span className="text-3xl">?</span>
        </div>
      )}
    </div>
    <h3 className="text-center font-semibold mb-1">{badge.name}</h3>
    <p className="text-sm text-gray-600 text-center">{badge.description}</p>
    <div className="absolute top-2 right-2 text-xs font-mono text-gray-500">
      {badge.personality}
    </div>
  </motion.div>
);

export default function BadgeCollection() {
  const { state } = useGame();

  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Badges</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {state.collectedBadges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </div>
    </div>
  );
}

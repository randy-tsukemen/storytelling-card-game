'use client';

import React from 'react';
import { GameProvider } from './context/GameContext';
import StoryGame from './components/StoryGame';
import BadgeCollection from './components/BadgeCollection';

export default function Home() {
  return (
    <GameProvider>
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Story Adventure
            </h1>
            <p className="text-gray-300 text-lg">
              Make choices, shape your story, collect unique badges
            </p>
          </header>

          <div className="grid gap-8">
            <StoryGame />
            <BadgeCollection />
          </div>
        </div>
      </main>
    </GameProvider>
  );
}

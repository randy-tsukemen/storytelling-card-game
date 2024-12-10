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
              命運的輪迴
            </h1>
            <p className="text-gray-300 text-lg">
              在這場與女帝的命運糾纏中，你的每個選擇都將改寫歷史
            </p>
            <p className="text-gray-400 text-sm mt-2">
              三世輪迴，你能否找到改變悲劇的關鍵？
            </p>
          </header>

          <div className="grid gap-8">
            <StoryGame />
            <div className="bg-gray-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">獲得的印記</h2>
              <BadgeCollection />
            </div>
          </div>
        </div>
      </main>
    </GameProvider>
  );
}

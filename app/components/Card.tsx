// components/Card.tsx
import { StoryChoice } from '../types/story';

interface CardProps {
  choice: StoryChoice;
  onSelect: () => void;
}

export const Card = ({ choice, onSelect }: CardProps) => {
  return (
    <div 
      className="relative w-64 h-96 bg-white rounded-lg shadow-lg cursor-pointer transform transition-transform hover:scale-105"
      onClick={onSelect}
    >
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{choice.personality.name}</h3>
        <p className="text-gray-700">{choice.text}</p>
      </div>
    </div>
  );
};

// components/StoryText.tsx
interface StoryTextProps {
  text: string;
}

export const StoryText = ({ text }: StoryTextProps) => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 rounded-lg">
      <p className="text-lg leading-relaxed">{text}</p>
    </div>
  );
};

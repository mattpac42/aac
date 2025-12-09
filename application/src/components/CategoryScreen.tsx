import { ArrowLeft } from 'lucide-react';
import { WordButton } from './WordButton';
import { Button } from './ui/button';
import type { CategoryName, CategoryWord } from '../App';
import type { WordTypeColors } from './settings/ColorThemeScreen';

interface CategoryScreenProps {
  category: CategoryName;
  categoryWords: Record<string, CategoryWord[]>;
  wordTypeColors: WordTypeColors;
  onWordSelect: (word: string) => void;
  onBack: () => void;
}

export function CategoryScreen({ category, categoryWords, wordTypeColors, onWordSelect, onBack }: CategoryScreenProps) {
  const words = categoryWords[category] || [];

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col gap-6 h-full">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          onClick={onBack}
          size="lg"
          variant="outline"
          className="rounded-xl"
        >
          <ArrowLeft className="h-6 w-6 mr-2" />
          Back to Core Board
        </Button>
        <h1 className="text-slate-700">{category}</h1>
      </div>

      {/* Category Words Grid */}
      <div className="grid grid-cols-5 gap-4 flex-1 content-start">
        {words.map((word, index) => (
          <WordButton
            key={index}
            text={word.text}
            icon={word.icon as any}
            type="noun"
            customColors={wordTypeColors.noun}
            onClick={onWordSelect}
          />
        ))}
      </div>
    </div>
  );
}
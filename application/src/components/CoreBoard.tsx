import { WordButton } from './WordButton';
import { CategoryButton } from './CategoryButton';
import type { CategoryName, Word } from '../App';
import type { WordTypeColors } from './settings/ColorThemeScreen';

interface CoreBoardProps {
  words: Word[];
  wordTypeColors: WordTypeColors;
  onWordSelect: (word: string) => void;
  onNavigate: (category: CategoryName) => void;
}

export function CoreBoard({ words, wordTypeColors, onWordSelect, onNavigate }: CoreBoardProps) {
  const categories = [
    { name: 'People', icon: 'Users', variant: 'default' as const },
    { name: 'Food', icon: 'Pizza', variant: 'default' as const },
    { name: 'Places', icon: 'MapPin', variant: 'default' as const },
    { name: 'Feelings', icon: 'Heart', variant: 'default' as const },
    { name: 'Actions', icon: 'Zap', variant: 'default' as const },
    { name: 'School', icon: 'BookOpen', variant: 'default' as const },
    { name: 'Weather', icon: 'Cloud', variant: 'default' as const },
    { name: 'Resources', icon: 'GraduationCap', variant: 'accent' as const },
    { name: 'Settings', icon: 'Settings', variant: 'accent' as const },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col gap-6 h-full">
      {/* Main Core Vocabulary Grid */}
      <div className="grid grid-cols-5 gap-4 flex-1">
        {words.map((word, index) => (
          <WordButton
            key={index}
            text={word.text}
            icon={word.icon as any}
            type={word.type}
            customColors={wordTypeColors[word.type]}
            onClick={onWordSelect}
          />
        ))}
      </div>

      {/* Category Navigation */}
      <div className="grid grid-cols-9 gap-4">
        {categories.map((category, index) => (
          <CategoryButton
            key={index}
            name={category.name}
            icon={category.icon as any}
            variant={category.variant}
            onClick={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}
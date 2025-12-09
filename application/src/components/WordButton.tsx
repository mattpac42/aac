import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import type { WordType } from '../App';

interface WordButtonProps {
  text: string;
  icon: keyof typeof LucideIcons;
  type: WordType;
  onClick: (word: string) => void;
  customColors?: { bg: string; border: string; };
}

export function WordButton({ text, icon, type, onClick, customColors }: WordButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  
  const IconComponent = LucideIcons[icon] as React.ComponentType<{ className?: string }>;

  const handleClick = () => {
    setIsPressed(true);
    onClick(text);
    setTimeout(() => setIsPressed(false), 150);
  };

  // Use custom colors if provided, otherwise use defaults
  const bgClass = customColors?.bg || 'bg-yellow-200';
  const borderClass = customColors?.border || 'border-yellow-400';
  
  // Create hover variant by replacing the number in the bg class
  const hoverBgClass = bgClass.replace(/(\d+)/, (match) => String(parseInt(match) + 100));

  return (
    <button
      onClick={handleClick}
      className={`
        ${bgClass} hover:${hoverBgClass} ${borderClass}
        rounded-2xl border-4 p-4
        flex flex-col items-center justify-center gap-2
        transition-all duration-150 active:scale-95
        min-h-[120px] w-full
        ${isPressed ? 'scale-95 shadow-inner' : 'shadow-lg'}
      `}
    >
      {IconComponent && <IconComponent className="h-10 w-10 text-slate-700" />}
      <span className="text-slate-800 text-center leading-tight">{text}</span>
    </button>
  );
}
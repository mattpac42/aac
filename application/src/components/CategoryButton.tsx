import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import type { CategoryName } from '../App';

interface CategoryButtonProps {
  name: string;
  icon: keyof typeof LucideIcons;
  onClick: (category: CategoryName) => void;
  variant?: 'default' | 'accent';
}

export function CategoryButton({ name, icon, onClick, variant = 'default' }: CategoryButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  
  const IconComponent = LucideIcons[icon] as React.ComponentType<{ className?: string }>;

  const handleClick = () => {
    setIsPressed(true);
    onClick(name as CategoryName);
    setTimeout(() => setIsPressed(false), 150);
  };

  const colorClasses = variant === 'accent' 
    ? 'bg-slate-300 hover:bg-slate-400 border-slate-500'
    : 'bg-purple-200 hover:bg-purple-300 border-purple-400';

  return (
    <button
      onClick={handleClick}
      className={`
        ${colorClasses}
        rounded-2xl border-4 p-3
        flex flex-col items-center justify-center gap-1
        transition-all duration-150 active:scale-95
        min-h-[100px] w-full
        ${isPressed ? 'scale-95 shadow-inner' : 'shadow-lg'}
      `}
    >
      {IconComponent && <IconComponent className="h-8 w-8 text-slate-700" />}
      <span className="text-slate-800 text-center leading-tight">{name}</span>
    </button>
  );
}
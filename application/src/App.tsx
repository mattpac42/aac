import { useState } from 'react';
import { CoreBoard } from './components/CoreBoard';
import { CategoryScreen } from './components/CategoryScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { ResourcesScreen } from './components/ResourcesScreen';
import { MessageBar } from './components/MessageBar';
import type { WordTypeColors } from './components/settings/ColorThemeScreen';

export type WordType = 'pronoun' | 'verb' | 'descriptive' | 'noun' | 'social';

export interface Word {
  text: string;
  icon: string;
  type: WordType;
}

export interface CategoryWord {
  text: string;
  icon: string;
}

export type CategoryName = 'People' | 'Food' | 'Places' | 'Feelings' | 'Actions' | 'School' | 'Weather' | 'Settings' | 'Resources' | 'Core';

const initialCoreWords: Word[] = [
  // Row 1
  { text: 'I', icon: 'User', type: 'pronoun' },
  { text: 'want', icon: 'Hand', type: 'verb' },
  { text: 'more', icon: 'Plus', type: 'social' },
  { text: 'go', icon: 'ArrowRight', type: 'verb' },
  { text: 'stop', icon: 'StopCircle', type: 'verb' },
  
  // Row 2
  { text: 'help', icon: 'HelpCircle', type: 'verb' },
  { text: 'me', icon: 'UserCircle', type: 'pronoun' },
  { text: 'my', icon: 'Heart', type: 'pronoun' },
  { text: 'like', icon: 'ThumbsUp', type: 'verb' },
  { text: 'don\'t', icon: 'X', type: 'social' },
  
  // Row 3
  { text: 'good', icon: 'Smile', type: 'descriptive' },
  { text: 'bad', icon: 'Frown', type: 'descriptive' },
  { text: 'yes', icon: 'Check', type: 'social' },
  { text: 'no', icon: 'Ban', type: 'social' },
  { text: 'play', icon: 'Gamepad2', type: 'verb' },
  
  // Row 4
  { text: 'eat', icon: 'Utensils', type: 'verb' },
  { text: 'drink', icon: 'Cup', type: 'verb' },
  { text: 'sleep', icon: 'Moon', type: 'verb' },
  { text: 'open', icon: 'FolderOpen', type: 'verb' },
  { text: 'close', icon: 'FolderClosed', type: 'verb' },
  
  // Row 5
  { text: 'turn', icon: 'RotateCw', type: 'verb' },
  { text: 'on', icon: 'Power', type: 'social' },
  { text: 'off', icon: 'PowerOff', type: 'social' },
  { text: 'up', icon: 'ArrowUp', type: 'social' },
  { text: 'down', icon: 'ArrowDown', type: 'social' },
  
  // Row 6
  { text: 'big', icon: 'Maximize2', type: 'descriptive' },
  { text: 'small', icon: 'Minimize2', type: 'descriptive' },
  { text: 'all done', icon: 'CheckCircle2', type: 'social' },
  { text: 'wait', icon: 'Timer', type: 'social' },
  { text: 'it', icon: 'Circle', type: 'pronoun' },
];

const initialCategoryWords: Record<string, CategoryWord[]> = {
  People: [
    { text: 'mom', icon: 'UserCircle' },
    { text: 'dad', icon: 'User' },
    { text: 'teacher', icon: 'GraduationCap' },
    { text: 'friend', icon: 'Users' },
    { text: 'brother', icon: 'User' },
    { text: 'sister', icon: 'UserCircle' },
    { text: 'grandma', icon: 'Heart' },
    { text: 'grandpa', icon: 'Heart' },
    { text: 'baby', icon: 'Baby' },
    { text: 'pet', icon: 'Dog' },
    { text: 'doctor', icon: 'Stethoscope' },
    { text: 'nurse', icon: 'Cross' },
    { text: 'family', icon: 'Home' },
    { text: 'child', icon: 'Baby' },
    { text: 'adult', icon: 'User' },
  ],
  Food: [
    { text: 'water', icon: 'Droplet' },
    { text: 'juice', icon: 'Cup' },
    { text: 'milk', icon: 'Milk' },
    { text: 'apple', icon: 'Apple' },
    { text: 'banana', icon: 'Banana' },
    { text: 'cracker', icon: 'Cookie' },
    { text: 'cookie', icon: 'Cookie' },
    { text: 'sandwich', icon: 'Sandwich' },
    { text: 'cereal', icon: 'Bowl' },
    { text: 'pizza', icon: 'Pizza' },
    { text: 'bread', icon: 'Wheat' },
    { text: 'snack', icon: 'Package' },
    { text: 'lunch', icon: 'UtensilsCrossed' },
    { text: 'breakfast', icon: 'Sunrise' },
    { text: 'dinner', icon: 'Utensils' },
    { text: 'hungry', icon: 'UtensilsCrossed' },
    { text: 'thirsty', icon: 'Droplets' },
  ],
  Places: [
    { text: 'home', icon: 'Home' },
    { text: 'school', icon: 'School' },
    { text: 'park', icon: 'Trees' },
    { text: 'store', icon: 'Store' },
    { text: 'bathroom', icon: 'Bath' },
    { text: 'car', icon: 'Car' },
    { text: 'outside', icon: 'Trees' },
    { text: 'bed', icon: 'Bed' },
    { text: 'kitchen', icon: 'ChefHat' },
    { text: 'bedroom', icon: 'BedDouble' },
    { text: 'playground', icon: 'Carousel' },
    { text: 'library', icon: 'Library' },
    { text: 'hospital', icon: 'Hospital' },
    { text: 'restaurant', icon: 'UtensilsCrossed' },
    { text: 'beach', icon: 'Waves' },
  ],
  Feelings: [
    { text: 'happy', icon: 'Smile' },
    { text: 'sad', icon: 'Frown' },
    { text: 'mad', icon: 'Angry' },
    { text: 'tired', icon: 'Moon' },
    { text: 'scared', icon: 'Skull' },
    { text: 'sick', icon: 'Thermometer' },
    { text: 'excited', icon: 'PartyPopper' },
    { text: 'bored', icon: 'Meh' },
    { text: 'okay', icon: 'ThumbsUp' },
    { text: 'love', icon: 'HeartHandshake' },
    { text: 'worry', icon: 'AlertCircle' },
    { text: 'calm', icon: 'CloudSun' },
    { text: 'angry', icon: 'Angry' },
    { text: 'confused', icon: 'HelpCircle' },
    { text: 'proud', icon: 'Award' },
    { text: 'hurt', icon: 'Bandage' },
  ],
  Actions: [
    { text: 'run', icon: 'PersonStanding' },
    { text: 'jump', icon: 'ArrowUp' },
    { text: 'walk', icon: 'Footprints' },
    { text: 'sit', icon: 'Armchair' },
    { text: 'dance', icon: 'Music' },
    { text: 'sing', icon: 'Mic2' },
    { text: 'play', icon: 'Gamepad2' },
    { text: 'read', icon: 'BookOpen' },
    { text: 'draw', icon: 'Pencil' },
    { text: 'wash', icon: 'Droplets' },
    { text: 'watch', icon: 'Eye' },
    { text: 'listen', icon: 'Ear' },
    { text: 'look', icon: 'Eye' },
    { text: 'write', icon: 'PenTool' },
    { text: 'color', icon: 'Palette' },
    { text: 'cut', icon: 'Scissors' },
    { text: 'build', icon: 'Boxes' },
  ],
  School: [
    { text: 'book', icon: 'Book' },
    { text: 'pencil', icon: 'Pencil' },
    { text: 'paper', icon: 'FileText' },
    { text: 'teacher', icon: 'GraduationCap' },
    { text: 'friend', icon: 'Users' },
    { text: 'computer', icon: 'Monitor' },
    { text: 'desk', icon: 'Box' },
    { text: 'backpack', icon: 'Backpack' },
    { text: 'crayon', icon: 'Palette' },
    { text: 'scissors', icon: 'Scissors' },
    { text: 'glue', icon: 'Droplet' },
    { text: 'class', icon: 'School' },
    { text: 'homework', icon: 'FileEdit' },
    { text: 'lesson', icon: 'BookMarked' },
    { text: 'recess', icon: 'PlayCircle' },
  ],
  Weather: [
    { text: 'sun', icon: 'Sun' },
    { text: 'rain', icon: 'CloudRain' },
    { text: 'hot', icon: 'Flame' },
    { text: 'cold', icon: 'Snowflake' },
    { text: 'cloudy', icon: 'Cloud' },
    { text: 'windy', icon: 'Wind' },
    { text: 'snow', icon: 'Snowflake' },
    { text: 'storm', icon: 'CloudLightning' },
    { text: 'sunny', icon: 'Sun' },
    { text: 'warm', icon: 'Thermometer' },
    { text: 'cool', icon: 'AirVent' },
    { text: 'foggy', icon: 'CloudFog' },
    { text: 'clear', icon: 'CloudSun' },
    { text: 'rainbow', icon: 'Rainbow' },
  ],
};

const defaultWordTypeColors: WordTypeColors = {
  pronoun: { bg: 'bg-yellow-200', border: 'border-yellow-400' },
  verb: { bg: 'bg-green-200', border: 'border-green-400' },
  descriptive: { bg: 'bg-blue-200', border: 'border-blue-400' },
  noun: { bg: 'bg-orange-200', border: 'border-orange-400' },
  social: { bg: 'bg-pink-200', border: 'border-pink-400' },
};

export default function App() {
  const [message, setMessage] = useState<string[]>([]);
  const [currentScreen, setCurrentScreen] = useState<CategoryName>('Core');
  const [coreWords, setCoreWords] = useState<Word[]>(initialCoreWords);
  const [categoryWords, setCategoryWords] = useState<Record<string, CategoryWord[]>>(initialCategoryWords);
  const [wordTypeColors, setWordTypeColors] = useState<WordTypeColors>(defaultWordTypeColors);

  const addWord = (word: string) => {
    setMessage([...message, word]);
  };

  const clearMessage = () => {
    setMessage([]);
  };

  const speakMessage = () => {
    if (message.length === 0) return;
    
    const utterance = new SpeechSynthesisUtterance(message.join(' '));
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  const navigateToCategory = (category: CategoryName) => {
    setCurrentScreen(category);
  };

  const navigateToCore = () => {
    setCurrentScreen('Core');
  };

  const updateCoreWords = (newWords: Word[]) => {
    setCoreWords(newWords);
  };

  const updateCategoryWords = (newWords: Record<string, CategoryWord[]>) => {
    setCategoryWords(newWords);
  };

  const updateWordTypeColors = (colors: WordTypeColors) => {
    setWordTypeColors(colors);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <MessageBar 
        message={message}
        onSpeak={speakMessage}
        onClear={clearMessage}
      />
      
      <div className="flex-1 overflow-auto">
        {currentScreen === 'Core' ? (
          <CoreBoard 
            words={coreWords}
            wordTypeColors={wordTypeColors}
            onWordSelect={addWord}
            onNavigate={navigateToCategory}
          />
        ) : currentScreen === 'Settings' ? (
          <SettingsScreen 
            coreWords={coreWords}
            categoryWords={categoryWords}
            wordTypeColors={wordTypeColors}
            onUpdateCoreWords={updateCoreWords}
            onUpdateCategoryWords={updateCategoryWords}
            onUpdateColors={updateWordTypeColors}
            onBack={navigateToCore}
          />
        ) : currentScreen === 'Resources' ? (
          <ResourcesScreen 
            onBack={navigateToCore}
          />
        ) : (
          <CategoryScreen 
            category={currentScreen}
            categoryWords={categoryWords}
            wordTypeColors={wordTypeColors}
            onWordSelect={addWord}
            onBack={navigateToCore}
          />
        )}
      </div>
    </div>
  );
}
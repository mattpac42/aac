import { useState } from 'react';
import { ArrowLeft, Plus, Volume2, VolumeX, Grid3x3, Palette } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { EditWordsScreen } from './settings/EditWordsScreen';
import { VoiceSettingsScreen } from './settings/VoiceSettingsScreen';
import { VolumeSettingsScreen } from './settings/VolumeSettingsScreen';
import { GridLayoutScreen } from './settings/GridLayoutScreen';
import { ColorThemeScreen } from './settings/ColorThemeScreen';
import type { Word, CategoryWord } from '../App';
import type { WordTypeColors } from './settings/ColorThemeScreen';

interface SettingsScreenProps {
  coreWords: Word[];
  categoryWords: Record<string, CategoryWord[]>;
  wordTypeColors: WordTypeColors;
  onUpdateCoreWords: (words: Word[]) => void;
  onUpdateCategoryWords: (words: Record<string, CategoryWord[]>) => void;
  onUpdateColors: (colors: WordTypeColors) => void;
  onBack: () => void;
}

type SettingsView = 'main' | 'editWords' | 'voice' | 'volume' | 'grid' | 'color';

export function SettingsScreen({ coreWords, categoryWords, wordTypeColors, onUpdateCoreWords, onUpdateCategoryWords, onUpdateColors, onBack }: SettingsScreenProps) {
  const [currentView, setCurrentView] = useState<SettingsView>('main');

  if (currentView === 'editWords') {
    return <EditWordsScreen coreWords={coreWords} categoryWords={categoryWords} wordTypeColors={wordTypeColors} onUpdateCoreWords={onUpdateCoreWords} onUpdateCategoryWords={onUpdateCategoryWords} onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'voice') {
    return <VoiceSettingsScreen onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'volume') {
    return <VolumeSettingsScreen onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'grid') {
    return <GridLayoutScreen onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'color') {
    return <ColorThemeScreen wordTypeColors={wordTypeColors} onUpdateColors={onUpdateColors} onBack={() => setCurrentView('main')} />;
  }

  // Main settings menu
  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col gap-6 h-full">
      {/* Header */}
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
        <div>
          <h1 className="text-slate-700">Settings & Customization</h1>
          <p className="text-slate-600">Customize your communication board</p>
        </div>
      </div>

      {/* Settings Options Grid */}
      <div className="grid grid-cols-2 gap-6 flex-1 content-start">
        <Card
          className="p-8 cursor-pointer hover:border-blue-500 transition-all hover:shadow-lg"
          onClick={() => setCurrentView('editWords')}
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <Plus className="h-10 w-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-slate-800">Edit Words</h2>
              <p className="text-slate-600">Manage vocabulary on your board and categories</p>
            </div>
          </div>
        </Card>

        <Card
          className="p-8 cursor-pointer hover:border-blue-500 transition-all hover:shadow-lg"
          onClick={() => setCurrentView('voice')}
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
              <Volume2 className="h-10 w-10 text-purple-600" />
            </div>
            <div>
              <h2 className="text-slate-800">Change Voice</h2>
              <p className="text-slate-600">Select voice type and language</p>
            </div>
          </div>
        </Card>

        <Card
          className="p-8 cursor-pointer hover:border-blue-500 transition-all hover:shadow-lg"
          onClick={() => setCurrentView('volume')}
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
              <VolumeX className="h-10 w-10 text-orange-600" />
            </div>
            <div>
              <h2 className="text-slate-800">Adjust Volume</h2>
              <p className="text-slate-600">Control sound levels and speed</p>
            </div>
          </div>
        </Card>

        <Card
          className="p-8 cursor-pointer hover:border-blue-500 transition-all hover:shadow-lg"
          onClick={() => setCurrentView('grid')}
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <Grid3x3 className="h-10 w-10 text-blue-600" />
            </div>
            <div>
              <h2 className="text-slate-800">Grid Layout</h2>
              <p className="text-slate-600">Adjust grid size and button spacing</p>
            </div>
          </div>
        </Card>

        <Card
          className="p-8 cursor-pointer hover:border-blue-500 transition-all hover:shadow-lg col-span-2"
          onClick={() => setCurrentView('color')}
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center">
              <Palette className="h-10 w-10 text-pink-600" />
            </div>
            <div>
              <h2 className="text-slate-800">Colors & Theme</h2>
              <p className="text-slate-600">Customize colors and visual appearance</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Version Display */}
      <div className="text-center text-xs text-gray-400 mt-auto pb-4">
        {__APP_VERSION__} ({__GIT_COMMIT__})
      </div>
    </div>
  );
}
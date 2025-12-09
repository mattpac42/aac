import { useState } from 'react';
import { ArrowLeft, Palette, Eye, Moon, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export interface WordTypeColors {
  pronoun: { bg: string; border: string; };
  verb: { bg: string; border: string; };
  descriptive: { bg: string; border: string; };
  noun: { bg: string; border: string; };
  social: { bg: string; border: string; };
}

interface ColorThemeScreenProps {
  wordTypeColors: WordTypeColors;
  onUpdateColors: (colors: WordTypeColors) => void;
  onBack: () => void;
}

interface ColorScheme {
  name: string;
  description: string;
  colors: WordTypeColors;
}

const colorOptions = [
  { value: 'yellow', label: 'Yellow', bg: 'bg-yellow-200', border: 'border-yellow-400', preview: 'bg-yellow-300' },
  { value: 'green', label: 'Green', bg: 'bg-green-200', border: 'border-green-400', preview: 'bg-green-300' },
  { value: 'blue', label: 'Blue', bg: 'bg-blue-200', border: 'border-blue-400', preview: 'bg-blue-300' },
  { value: 'orange', label: 'Orange', bg: 'bg-orange-200', border: 'border-orange-400', preview: 'bg-orange-300' },
  { value: 'pink', label: 'Pink', bg: 'bg-pink-200', border: 'border-pink-400', preview: 'bg-pink-300' },
  { value: 'purple', label: 'Purple', bg: 'bg-purple-200', border: 'border-purple-400', preview: 'bg-purple-300' },
  { value: 'red', label: 'Red', bg: 'bg-red-200', border: 'border-red-400', preview: 'bg-red-300' },
  { value: 'cyan', label: 'Cyan', bg: 'bg-cyan-200', border: 'border-cyan-400', preview: 'bg-cyan-300' },
  { value: 'teal', label: 'Teal', bg: 'bg-teal-200', border: 'border-teal-400', preview: 'bg-teal-300' },
  { value: 'lime', label: 'Lime', bg: 'bg-lime-200', border: 'border-lime-400', preview: 'bg-lime-300' },
  { value: 'amber', label: 'Amber', bg: 'bg-amber-200', border: 'border-amber-400', preview: 'bg-amber-300' },
  { value: 'rose', label: 'Rose', bg: 'bg-rose-200', border: 'border-rose-400', preview: 'bg-rose-300' },
];

export function ColorThemeScreen({ wordTypeColors, onUpdateColors, onBack }: ColorThemeScreenProps) {
  const [highContrast, setHighContrast] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [customColors, setCustomColors] = useState<WordTypeColors>(wordTypeColors);

  const colorSchemes: ColorScheme[] = [
    {
      name: 'Default',
      description: 'Standard color palette',
      colors: {
        pronoun: { bg: 'bg-yellow-200', border: 'border-yellow-400' },
        verb: { bg: 'bg-green-200', border: 'border-green-400' },
        descriptive: { bg: 'bg-blue-200', border: 'border-blue-400' },
        noun: { bg: 'bg-orange-200', border: 'border-orange-400' },
        social: { bg: 'bg-pink-200', border: 'border-pink-400' },
      }
    },
    {
      name: 'Pastel',
      description: 'Softer, lighter colors',
      colors: {
        pronoun: { bg: 'bg-yellow-100', border: 'border-yellow-300' },
        verb: { bg: 'bg-green-100', border: 'border-green-300' },
        descriptive: { bg: 'bg-blue-100', border: 'border-blue-300' },
        noun: { bg: 'bg-orange-100', border: 'border-orange-300' },
        social: { bg: 'bg-pink-100', border: 'border-pink-300' },
      }
    },
    {
      name: 'Bright',
      description: 'Vivid, high-contrast colors',
      colors: {
        pronoun: { bg: 'bg-yellow-300', border: 'border-yellow-500' },
        verb: { bg: 'bg-green-300', border: 'border-green-500' },
        descriptive: { bg: 'bg-blue-300', border: 'border-blue-500' },
        noun: { bg: 'bg-orange-300', border: 'border-orange-500' },
        social: { bg: 'bg-pink-300', border: 'border-pink-500' },
      }
    },
  ];

  const wordTypes = [
    { type: 'Pronouns', example: 'I, me, my', key: 'pronoun' as const },
    { type: 'Verbs', example: 'go, stop, want', key: 'verb' as const },
    { type: 'Descriptive', example: 'big, good, bad', key: 'descriptive' as const },
    { type: 'Nouns', example: 'people, food, places', key: 'noun' as const },
    { type: 'Social', example: 'yes, no, please', key: 'social' as const },
  ];

  const applyScheme = (scheme: ColorScheme) => {
    setCustomColors(scheme.colors);
  };

  const handleColorChange = (wordType: keyof WordTypeColors, colorValue: string) => {
    const colorOption = colorOptions.find(c => c.value === colorValue);
    if (colorOption) {
      setCustomColors({
        ...customColors,
        [wordType]: {
          bg: colorOption.bg,
          border: colorOption.border
        }
      });
    }
  };

  const getColorValue = (bg: string): string => {
    const match = bg.match(/bg-(\w+)-/);
    return match ? match[1] : 'yellow';
  };

  const handleSave = () => {
    onUpdateColors(customColors);
    onBack();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          onClick={onBack}
          size="lg"
          variant="outline"
          className="rounded-xl"
        >
          <ArrowLeft className="h-6 w-6 mr-2" />
          Back to Settings
        </Button>
        <div>
          <h1 className="text-slate-700">Color and Theme</h1>
          <p className="text-slate-600">Customize colors and appearance</p>
        </div>
      </div>

      {/* Accessibility Toggles */}
      <div className="grid grid-cols-2 gap-4">
        <Card 
          className={`p-6 cursor-pointer transition-all ${highContrast ? 'bg-blue-50 border-blue-500 border-2' : ''}`}
          onClick={() => setHighContrast(!highContrast)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="h-8 w-8 text-slate-700" />
              <div>
                <p className="text-slate-800">High Contrast Mode</p>
                <p className="text-slate-600">Stronger colors and borders</p>
              </div>
            </div>
            <Switch checked={highContrast} onCheckedChange={setHighContrast} />
          </div>
        </Card>

        <Card 
          className={`p-6 cursor-pointer transition-all ${darkMode ? 'bg-blue-50 border-blue-500 border-2' : ''}`}
          onClick={() => setDarkMode(!darkMode)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="h-8 w-8 text-slate-700" />
              <div>
                <p className="text-slate-800">Dark Mode</p>
                <p className="text-slate-600">Dark background theme</p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </Card>
      </div>

      {/* Quick Color Scheme Selection */}
      <div className="space-y-4">
        <Label>Quick Apply: Choose Color Scheme</Label>
        <div className="grid grid-cols-3 gap-4">
          {colorSchemes.map((scheme, index) => (
            <button
              key={index}
              className={`
                ${index === 0 ? 'bg-yellow-200 hover:bg-yellow-300 border-yellow-400' : ''}
                ${index === 1 ? 'bg-green-200 hover:bg-green-300 border-green-400' : ''}
                ${index === 2 ? 'bg-purple-200 hover:bg-purple-300 border-purple-400' : ''}
                rounded-2xl border-4 p-6
                flex flex-col gap-3
                transition-all duration-150 active:scale-95
                min-h-[160px]
              `}
              onClick={() => applyScheme(scheme)}
            >
              <Palette className="h-10 w-10 text-slate-700" />
              <div className="text-center">
                <p className="text-slate-800">{scheme.name}</p>
                <p className="text-slate-600">{scheme.description}</p>
              </div>
              <div className="flex gap-1 mt-2">
                <div className={`h-6 flex-1 rounded ${scheme.colors.pronoun.bg}`} />
                <div className={`h-6 flex-1 rounded ${scheme.colors.verb.bg}`} />
                <div className={`h-6 flex-1 rounded ${scheme.colors.descriptive.bg}`} />
                <div className={`h-6 flex-1 rounded ${scheme.colors.noun.bg}`} />
                <div className={`h-6 flex-1 rounded ${scheme.colors.social.bg}`} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color Selection */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Label>Customize Individual Colors</Label>
          <Button
            size="sm"
            variant="outline"
            onClick={() => applyScheme(colorSchemes[0])}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
        </div>
        
        <div className="grid grid-cols-5 gap-4">
          {wordTypes.map((item) => {
            const currentColor = customColors[item.key];
            const colorValue = getColorValue(currentColor.bg);
            
            return (
              <div key={item.type} className="space-y-2">
                <Label className="text-slate-700">{item.type}</Label>
                <div className={`w-full h-20 rounded-lg border-4 ${currentColor.bg} ${currentColor.border} flex items-center justify-center mb-2`}>
                  <span className="text-slate-800">{item.type}</span>
                </div>
                <Select value={colorValue} onValueChange={(value) => handleColorChange(item.key, value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded ${color.preview}`} />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-slate-500 text-center">{item.example}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Preview */}
      <Card className="p-6 space-y-4">
        <Label>Preview Your Theme</Label>
        <div className={`rounded-lg p-6 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <div className="grid grid-cols-5 gap-3">
            {['I', 'want', 'good', 'food', 'yes'].map((word, i) => {
              const types: Array<keyof WordTypeColors> = ['pronoun', 'verb', 'descriptive', 'noun', 'social'];
              const colorClass = customColors[types[i]];
              
              return (
                <div
                  key={i}
                  className={`p-4 rounded-lg ${colorClass.bg} ${colorClass.border} ${
                    highContrast ? 'border-4' : 'border-2'
                  } text-center`}
                >
                  <p className={darkMode ? 'text-slate-900' : 'text-slate-800'}>{word}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <Button 
        className="w-full bg-green-600 hover:bg-green-700 h-16"
        onClick={handleSave}
      >
        Apply Theme Changes
      </Button>
    </div>
  );
}
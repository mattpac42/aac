import { useState } from 'react';
import { ArrowLeft, Grid3x3, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Slider } from '../ui/slider';

interface GridLayoutScreenProps {
  onBack: () => void;
}

export function GridLayoutScreen({ onBack }: GridLayoutScreenProps) {
  const [gridSize, setGridSize] = useState<'3x3' | '4x4' | '5x5' | '5x6' | '6x6' | '7x7'>('5x6');
  const [buttonSize, setButtonSize] = useState([120]);
  const [spacing, setSpacing] = useState([16]);

  const gridOptions: Array<{ value: '3x3' | '4x4' | '5x5' | '5x6' | '6x6' | '7x7'; label: string; description: string; color: string }> = [
    { value: '3x3', label: '3×3', description: '9 buttons', color: 'bg-green-200 hover:bg-green-300 border-green-400' },
    { value: '4x4', label: '4×4', description: '16 buttons', color: 'bg-blue-200 hover:bg-blue-300 border-blue-400' },
    { value: '5x5', label: '5×5', description: '25 buttons', color: 'bg-purple-200 hover:bg-purple-300 border-purple-400' },
    { value: '5x6', label: '5×6', description: '30 buttons', color: 'bg-orange-200 hover:bg-orange-300 border-orange-400' },
    { value: '6x6', label: '6×6', description: '36 buttons', color: 'bg-pink-200 hover:bg-pink-300 border-pink-400' },
    { value: '7x7', label: '7×7', description: '49 buttons', color: 'bg-yellow-200 hover:bg-yellow-300 border-yellow-400' },
  ];

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
          <h1 className="text-slate-700">Grid Size</h1>
          <p className="text-slate-600">Change grid layout and button size</p>
        </div>
      </div>

      {/* Grid Size Selection */}
      <div className="space-y-4">
        <Label>Choose Grid Size</Label>
        <div className="grid grid-cols-3 gap-4">
          {gridOptions.map((option) => (
            <button
              key={option.value}
              className={`
                ${option.color}
                rounded-2xl border-4 p-6
                flex flex-col items-center justify-center gap-3
                transition-all duration-150 active:scale-95
                min-h-[140px]
                ${gridSize === option.value ? 'ring-4 ring-blue-500 ring-offset-2' : ''}
              `}
              onClick={() => setGridSize(option.value)}
            >
              <Grid3x3 className="h-10 w-10 text-slate-700" />
              <div className="text-center">
                <p className="text-slate-800">{option.label} Grid</p>
                <p className="text-slate-600">{option.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Button Size */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Label>Button Size</Label>
          <span className="text-slate-700">{buttonSize[0]}px</span>
        </div>
        <div className="flex items-center gap-4">
          <Minimize2 className="h-5 w-5 text-slate-400" />
          <Slider
            value={buttonSize}
            onValueChange={setButtonSize}
            min={80}
            max={180}
            step={10}
            className="flex-1"
          />
          <Maximize2 className="h-5 w-5 text-slate-700" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={buttonSize[0] === 100 ? 'default' : 'outline'}
            onClick={() => setButtonSize([100])}
          >
            Small
          </Button>
          <Button
            variant={buttonSize[0] === 130 ? 'default' : 'outline'}
            onClick={() => setButtonSize([130])}
          >
            Medium
          </Button>
          <Button
            variant={buttonSize[0] === 160 ? 'default' : 'outline'}
            onClick={() => setButtonSize([160])}
          >
            Large
          </Button>
        </div>
      </Card>

      {/* Button Spacing */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Label>Button Spacing</Label>
          <span className="text-slate-700">{spacing[0]}px</span>
        </div>
        <Slider
          value={spacing}
          onValueChange={setSpacing}
          min={4}
          max={32}
          step={4}
          className="flex-1"
        />
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={spacing[0] === 8 ? 'default' : 'outline'}
            onClick={() => setSpacing([8])}
          >
            Tight
          </Button>
          <Button
            variant={spacing[0] === 16 ? 'default' : 'outline'}
            onClick={() => setSpacing([16])}
          >
            Normal
          </Button>
          <Button
            variant={spacing[0] === 24 ? 'default' : 'outline'}
            onClick={() => setSpacing([24])}
          >
            Wide
          </Button>
        </div>
      </Card>

      {/* Preview */}
      <Card className="p-6 space-y-4">
        <Label>Preview</Label>
        <div className="bg-slate-100 rounded-lg p-8 flex items-center justify-center overflow-auto">
          <div 
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${gridSize.split('x')[0]}, 1fr)`,
              gap: `${spacing[0] / 2}px`
            }}
          >
            {Array.from({ length: Math.min(parseInt(gridSize.split('x')[0]) * parseInt(gridSize.split('x')[1]), 15) }).map((_, i) => (
              <div
                key={i}
                className="bg-blue-200 rounded-lg border-2 border-blue-400 flex items-center justify-center"
                style={{
                  width: `${buttonSize[0] / 2}px`,
                  height: `${buttonSize[0] / 2}px`
                }}
              >
                <span className="text-slate-600">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <Button className="w-full bg-green-600 hover:bg-green-700 h-16">
        Apply Layout Changes
      </Button>
    </div>
  );
}

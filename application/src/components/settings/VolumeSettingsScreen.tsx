import { useState } from 'react';
import { ArrowLeft, Volume2, VolumeX, Volume1, Play } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Card } from '../ui/card';

interface VolumeSettingsScreenProps {
  onBack: () => void;
}

export function VolumeSettingsScreen({ onBack }: VolumeSettingsScreenProps) {
  const [volume, setVolume] = useState([80]);

  const handleTestVolume = () => {
    const utterance = new SpeechSynthesisUtterance('Testing volume level.');
    utterance.volume = volume[0] / 100;
    window.speechSynthesis.speak(utterance);
  };

  const getVolumeIcon = () => {
    if (volume[0] === 0) return <VolumeX className="h-16 w-16 text-slate-400" />;
    if (volume[0] < 50) return <Volume1 className="h-16 w-16 text-slate-600" />;
    return <Volume2 className="h-16 w-16 text-slate-700" />;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col gap-6">
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
          <h1 className="text-slate-700">Volume Control</h1>
          <p className="text-slate-600">Adjust the speaker volume</p>
        </div>
      </div>

      {/* Volume Display */}
      <Card className="p-8">
        <div className="flex flex-col items-center gap-6">
          {getVolumeIcon()}
          <div className="text-center">
            <div className="text-6xl text-slate-800">{volume[0]}%</div>
            <p className="text-slate-600 mt-2">
              {volume[0] === 0 && 'Muted'}
              {volume[0] > 0 && volume[0] < 30 && 'Very Quiet'}
              {volume[0] >= 30 && volume[0] < 60 && 'Quiet'}
              {volume[0] >= 60 && volume[0] < 85 && 'Medium'}
              {volume[0] >= 85 && 'Loud'}
            </p>
          </div>
        </div>
      </Card>

      {/* Volume Slider */}
      <Card className="p-6 space-y-6">
        <Label>Adjust Volume</Label>
        <div className="flex items-center gap-4">
          <VolumeX className="h-6 w-6 text-slate-400 flex-shrink-0" />
          <Slider
            value={volume}
            onValueChange={setVolume}
            min={0}
            max={100}
            step={5}
            className="flex-1"
          />
          <Volume2 className="h-6 w-6 text-slate-700 flex-shrink-0" />
        </div>
      </Card>

      {/* Quick Volume Presets */}
      <Card className="p-6 space-y-4">
        <Label>Quick Presets</Label>
        <div className="grid grid-cols-4 gap-3">
          <Button
            variant={volume[0] === 0 ? 'default' : 'outline'}
            onClick={() => setVolume([0])}
            className="h-20 flex flex-col gap-2"
          >
            <VolumeX className="h-6 w-6" />
            <span>Mute</span>
          </Button>
          <Button
            variant={volume[0] === 40 ? 'default' : 'outline'}
            onClick={() => setVolume([40])}
            className="h-20 flex flex-col gap-2"
          >
            <Volume1 className="h-6 w-6" />
            <span>Low</span>
          </Button>
          <Button
            variant={volume[0] === 70 ? 'default' : 'outline'}
            onClick={() => setVolume([70])}
            className="h-20 flex flex-col gap-2"
          >
            <Volume2 className="h-6 w-6" />
            <span>Medium</span>
          </Button>
          <Button
            variant={volume[0] === 100 ? 'default' : 'outline'}
            onClick={() => setVolume([100])}
            className="h-20 flex flex-col gap-2"
          >
            <Volume2 className="h-6 w-6" />
            <span>Max</span>
          </Button>
        </div>
      </Card>

      {/* Test and Save Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleTestVolume} className="flex-1 bg-blue-600 hover:bg-blue-700 h-16">
          <Play className="h-5 w-5 mr-2" />
          Test Volume
        </Button>
        <Button className="flex-1 bg-green-600 hover:bg-green-700 h-16">
          Save Settings
        </Button>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, Play } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card } from '../ui/card';

interface VoiceSettingsScreenProps {
  onBack: () => void;
}

export function VoiceSettingsScreen({ onBack }: VoiceSettingsScreenProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState([90]);
  const [pitch, setPitch] = useState([100]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleTestVoice = () => {
    const utterance = new SpeechSynthesisUtterance('Hello! This is how my voice sounds.');
    
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    
    utterance.rate = rate[0] / 100;
    utterance.pitch = pitch[0] / 100;
    
    window.speechSynthesis.speak(utterance);
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
          <h1 className="text-slate-700">Voice Settings</h1>
          <p className="text-slate-600">Choose voice and speaking speed</p>
        </div>
      </div>

      {/* Voice Selection */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Volume2 className="h-6 w-6 text-slate-700" />
          <Label>Select Voice</Label>
        </div>
        <Select value={selectedVoice} onValueChange={setSelectedVoice}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Choose a voice..." />
          </SelectTrigger>
          <SelectContent>
            {voices.map((voice, index) => (
              <SelectItem key={index} value={voice.name}>
                {voice.name} ({voice.lang})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-slate-500">
          Choose from {voices.length} available voices on your device
        </p>
      </Card>

      {/* Speaking Rate */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Label>Speaking Speed</Label>
          <span className="text-slate-700">{rate[0]}%</span>
        </div>
        <Slider
          value={rate}
          onValueChange={setRate}
          min={50}
          max={200}
          step={10}
          className="flex-1"
        />
        <div className="grid grid-cols-5 gap-2">
          <Button
            variant={rate[0] === 50 ? 'default' : 'outline'}
            onClick={() => setRate([50])}
            className="text-xs"
          >
            Very Slow
          </Button>
          <Button
            variant={rate[0] === 75 ? 'default' : 'outline'}
            onClick={() => setRate([75])}
            className="text-xs"
          >
            Slow
          </Button>
          <Button
            variant={rate[0] === 100 ? 'default' : 'outline'}
            onClick={() => setRate([100])}
            className="text-xs"
          >
            Normal
          </Button>
          <Button
            variant={rate[0] === 125 ? 'default' : 'outline'}
            onClick={() => setRate([125])}
            className="text-xs"
          >
            Fast
          </Button>
          <Button
            variant={rate[0] === 150 ? 'default' : 'outline'}
            onClick={() => setRate([150])}
            className="text-xs"
          >
            Very Fast
          </Button>
        </div>
      </Card>

      {/* Pitch Control */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Label>Voice Pitch</Label>
          <span className="text-slate-700">{pitch[0]}%</span>
        </div>
        <Slider
          value={pitch}
          onValueChange={setPitch}
          min={50}
          max={150}
          step={10}
          className="flex-1"
        />
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={pitch[0] === 75 ? 'default' : 'outline'}
            onClick={() => setPitch([75])}
          >
            Lower
          </Button>
          <Button
            variant={pitch[0] === 100 ? 'default' : 'outline'}
            onClick={() => setPitch([100])}
          >
            Normal
          </Button>
          <Button
            variant={pitch[0] === 125 ? 'default' : 'outline'}
            onClick={() => setPitch([125])}
          >
            Higher
          </Button>
        </div>
      </Card>

      {/* Test and Save Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleTestVoice} className="flex-1 bg-blue-600 hover:bg-blue-700 h-16">
          <Play className="h-5 w-5 mr-2" />
          Test Voice
        </Button>
        <Button className="flex-1 bg-green-600 hover:bg-green-700 h-16">
          Save Settings
        </Button>
      </div>
    </div>
  );
}

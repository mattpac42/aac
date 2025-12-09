import { Volume2, X } from 'lucide-react';
import { Button } from './ui/button';

interface MessageBarProps {
  message: string[];
  onSpeak: () => void;
  onClear: () => void;
}

export function MessageBar({ message, onSpeak, onClear }: MessageBarProps) {
  return (
    <div className="bg-white border-b-4 border-slate-300 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <div className="flex-1 bg-slate-100 rounded-xl p-4 min-h-[80px] flex items-center gap-2 flex-wrap">
          {message.length === 0 ? (
            <span className="text-slate-400 text-xl">Tap words to build your message...</span>
          ) : (
            <>
              {message.map((word, index) => (
                <span key={index} className="text-2xl text-slate-800">
                  {word}
                </span>
              ))}
            </>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={onClear}
            size="lg"
            variant="outline"
            className="h-[80px] w-[80px] rounded-xl"
            disabled={message.length === 0}
          >
            <X className="h-8 w-8" />
          </Button>
          
          <Button
            onClick={onSpeak}
            size="lg"
            className="h-[80px] px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
            disabled={message.length === 0}
          >
            <Volume2 className="h-10 w-10 mr-2" />
            <span className="text-xl">Speak</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

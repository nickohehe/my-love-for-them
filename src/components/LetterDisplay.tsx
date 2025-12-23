import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LetterDisplayProps {
  personName: string;
  letterContent: string;
  onBack: () => void;
}

const LetterDisplay = ({ personName, letterContent, onBack }: LetterDisplayProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-20">
      <div className="w-full max-w-2xl opacity-0 animate-scale-in">
        {/* Back button */}
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-6 text-foreground hover:text-accent hover:bg-secondary/50 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Selection
        </Button>

        {/* Letter container */}
        <div className="letter-paper relative">
          {/* Decorative wax seal */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <Heart className="w-6 h-6 text-primary-foreground" />
          </div>

          {/* Letter header */}
          <div className="text-center pt-6 pb-4 border-b border-christmas-gold/30">
            <div className="text-sm text-christmas-green uppercase tracking-widest mb-2">
              A Special Christmas Letter
            </div>
            <h1 className="font-display text-3xl text-christmas-green">
              Dear {personName}
            </h1>
          </div>

          {/* Letter content */}
          <div className="py-8 px-4 space-y-4 text-christmas-green-dark leading-relaxed text-lg font-body">
            {letterContent.split('\n\n').map((paragraph, index) => (
              <p key={index} className="first-letter:text-3xl first-letter:font-display first-letter:text-primary first-letter:float-left first-letter:mr-2 first-letter:mt-1">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Letter footer */}
          <div className="text-right pt-4 border-t border-christmas-gold/30">
            <div className="font-display text-xl text-christmas-green italic">
              With love and warm wishes,
            </div>
            <div className="text-christmas-red mt-2 text-lg">
              ❤️ Merry Christmas! 🎄
            </div>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-4 left-4 opacity-20 text-2xl">🎄</div>
          <div className="absolute top-4 right-4 opacity-20 text-2xl">⭐</div>
          <div className="absolute bottom-4 left-4 opacity-20 text-2xl">🎁</div>
          <div className="absolute bottom-4 right-4 opacity-20 text-2xl">❄️</div>
        </div>
      </div>
    </div>
  );
};

export default LetterDisplay;

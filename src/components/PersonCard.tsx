import { Gift, Star } from "lucide-react";

interface PersonCardProps {
  name: string;
  emoji: string;
  onClick: () => void;
  delay: number;
}

const PersonCard = ({ name, emoji, onClick, delay }: PersonCardProps) => {
  return (
    <button
      onClick={onClick}
      className="group cursor-pointer w-full max-w-[200px] opacity-0 animate-fade-in"
      style={{ 
        animationDelay: `${delay}ms`,
        fontFamily: 'Poppins, sans-serif'
      }}
    >
      <div className="relative rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm p-8 transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1">
        {/* Main content */}
        <div className="flex flex-col items-center gap-5">
          <div className="text-5xl mb-1 group-hover:scale-110 transition-transform duration-300">
            {emoji}
          </div>
          
          <h2 className="text-xl font-medium text-foreground group-hover:text-accent transition-colors tracking-tight">
            {name}
          </h2>
          
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-light mt-1">
            <Gift className="w-3.5 h-3.5" />
            <span>Click to open</span>
          </div>
        </div>
        
        {/* Subtle hover glow */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, hsl(var(--christmas-gold) / 0.05) 0%, transparent 70%)',
          }}
        />
      </div>
    </button>
  );
};

export default PersonCard;

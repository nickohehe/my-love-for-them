import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, KeyRound, XCircle } from "lucide-react";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  personName: string;
  onSuccess: () => void;
  correctPassword: string;
}

const PasswordModal = ({ isOpen, onClose, personName, onSuccess, correctPassword }: PasswordModalProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.toLowerCase() === correctPassword.toLowerCase()) {
      setPassword("");
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleClose = () => {
    setPassword("");
    setError(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-md">
        {/* Decorative elements */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl">🎅</div>
        
        <DialogHeader className="pt-4">
          <DialogTitle className="font-display text-2xl text-center text-foreground flex items-center justify-center gap-2">
            <Lock className="w-5 h-5 text-accent" />
            <span>Secret Letter for</span>
            <span className="gold-text">{personName}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="text-center text-muted-foreground text-sm">
            Enter the secret password to unlock your special Christmas letter 🎄
          </div>

          <div className={`relative transition-transform ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-accent"
              autoFocus
            />
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 text-destructive text-sm animate-fade-in">
              <XCircle className="w-4 h-4" />
              <span>Incorrect password. Try again!</span>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-border text-foreground hover:bg-secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 christmas-button text-primary-foreground"
            >
              Unlock Gift 🎁
            </Button>
          </div>
        </form>

        {/* Bottom decoration */}
        <div className="flex justify-center gap-2 pt-2">
          <span className="text-xl opacity-50">🎄</span>
          <span className="text-xl opacity-50">⭐</span>
          <span className="text-xl opacity-50">🎄</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordModal;

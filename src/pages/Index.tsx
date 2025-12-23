import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import Snowfall from "@/components/Snowfall";
import ChristmasDecorations from "@/components/ChristmasDecorations";
import PersonCard from "@/components/PersonCard";
import PasswordModal from "@/components/PasswordModal";
import LetterDisplay from "@/components/LetterDisplay";

interface Person {
  name: string;
  emoji: string;
  password: string;
  letter: string;
}

const people: Person[] = [
  {
    name: "Jhulia",
    emoji: "<3",
    password: "mycomfortperson",
    letter: `This Christmas, I want you to know how incredibly special you are. Your warmth lights up every room you enter, and your kindness touches everyone around you.

May this holiday season bring you all the joy and happiness you so richly deserve. You are a blessing to everyone who knows you, and I hope this letter reminds you of how loved and appreciated you truly are.

Here's to a magical Christmas filled with laughter, love, and wonderful memories. May the new year bring you success in all your endeavors and peace in your heart.`,
  },
  {
    name: "Sophia",
    emoji: "<3",
    password: "mysafespace",
    letter: `As the snow falls gently outside, I wanted to take a moment to tell you how much you mean to me. Your grace and beauty, both inside and out, inspire everyone around you.

This Christmas, may you feel the warmth of love surrounding you. You have a gift for making others feel special, and I hope you know that you are equally treasured and valued.

Wishing you a holiday season as wonderful as you are, filled with precious moments and endless joy. May the coming year bring you everything your heart desires.`,
  },
  {
    name: "Ram",
    emoji: "<3",
    password: "mydayone",
    letter: `In this season of giving, I want to give you something that can't be wrapped in paper - the knowledge of how much you are appreciated. Your strength and dedication inspire those around you every day.

Christmas is a time for reflection, and when I think about the people who make a difference in this world, you are always at the top of that list. Your hard work and determination never go unnoticed.

May this Christmas bring you rest, joy, and the company of those you love. Here's to a spectacular new year filled with success and wonderful adventures.`,
  },
  {
    name: "Thena",
    emoji: "<3",
    password: "mysoftspot",
    letter: `Like a star atop the Christmas tree, you shine bright in the lives of everyone who knows you. Your spirit is truly magical, and this letter is a small token of appreciation for being you.

This holiday season, I hope you feel surrounded by love and warmth. You bring so much light into this world, and it's only fitting that this Christmas showers you with blessings in return.

May your days be merry and bright, and may the new year bring you closer to all your dreams. You deserve nothing but the very best life has to offer.`,
  },
  {
    name: "Abiella",
    emoji: "<3",
    password: "mybestbestbestfriend",
    letter: `Like a star atop the Christmas tree, you shine bright in the lives of everyone who knows you. Your spirit is truly magical, and this letter is a small token of appreciation for being you.

This holiday season, I hope you feel surrounded by love and warmth. You bring so much light into this world, and it's only fitting that this Christmas showers you with blessings in return.

Adsddddddddddddddddddddddddddddddddddddddddddd

Addddddddddddddddddddddddddddd

May your days be merry and bright, and may the new year bring you closer to all your dreams. You deserve nothing but the very best life has to offer.`,
  },
];

const API_URL = import.meta.env.VITE_API_URL || '';

const Index = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [unlockedPerson, setUnlockedPerson] = useState<Person | null>(null);
  const [openedLetters, setOpenedLetters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const justOpenedLetterRef = useRef<string | null>(null);

  // Fetch opened letters on mount
  useEffect(() => {
    const fetchOpenedLetters = async () => {
      try {
        const response = await fetch(`${API_URL}/api/opened-letters`);
        if (response.ok) {
          const data = await response.json();
          setOpenedLetters(data);
        }
      } catch (error) {
        console.error('Error fetching opened letters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpenedLetters();
  }, []);

  // Listen for real-time notifications
  useEffect(() => {
    const eventSource = new EventSource(`${API_URL}/api/notifications`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'letter-opened' && data.name) {
          // Skip notification if this user just opened their own letter
          if (justOpenedLetterRef.current === data.name) {
            // Clear the flag after a short delay
            setTimeout(() => {
              justOpenedLetterRef.current = null;
            }, 2000);
            // Still update the opened letters list
            setOpenedLetters(prev => {
              if (!prev.includes(data.name)) {
                return [...prev, data.name];
              }
              return prev;
            });
            return;
          }

          // Find the person's emoji
          const person = people.find(p => p.name === data.name);
          const emoji = person?.emoji || '🎁';
          
          // Show notification
          toast.success(`${data.name} opened their letter! ${emoji}`, {
            description: 'A new letter has been unlocked',
            duration: 5000,
          });

          // Update opened letters list
          setOpenedLetters(prev => {
            if (!prev.includes(data.name)) {
              return [...prev, data.name];
            }
            return prev;
          });
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      // Reconnect after a delay
      setTimeout(() => {
        eventSource.close();
        // The useEffect will re-run and create a new connection
      }, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Mark letter as opened
  const markLetterAsOpened = async (name: string) => {
    try {
      const response = await fetch(`${API_URL}/api/opened-letters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        const data = await response.json();
        setOpenedLetters(data.openedLetters);
      }
    } catch (error) {
      console.error('Error marking letter as opened:', error);
    }
  };

  const handleCardClick = (person: Person) => {
    setSelectedPerson(person);
    setIsModalOpen(true);
  };

  const handlePasswordSuccess = async () => {
    if (selectedPerson) {
      // Track that this user is opening their own letter
      justOpenedLetterRef.current = selectedPerson.name;
      
      // Mark letter as opened on the server
      await markLetterAsOpened(selectedPerson.name);
      
      setIsModalOpen(false);
      setUnlockedPerson(selectedPerson);
      setShowLetter(true);
    }
  };

  const handleBackToSelection = () => {
    setShowLetter(false);
    setUnlockedPerson(null);
    setSelectedPerson(null);
  };

  if (showLetter && unlockedPerson) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <Snowfall />
        <ChristmasDecorations />
        <LetterDisplay
          personName={unlockedPerson.name}
          letterContent={unlockedPerson.letter}
          onBack={handleBackToSelection}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowfall />
      <ChristmasDecorations />

      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16 opacity-0 animate-fade-in" style={{ fontFamily: 'Poppins, sans-serif' }}>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold mb-3 tracking-tight">
            <span className="text-foreground">Merry </span>
            <span className="gold-text">Christmas</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto font-light">
            Select your name to unlock your special letter
          </p>
        </div>

        {/* Person Cards Grid */}
        {isLoading ? (
          <div className="text-muted-foreground font-light" style={{ fontFamily: 'Poppins, sans-serif' }}>Loading...</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 w-full max-w-5xl">
            {people
              .filter((person) => !openedLetters.includes(person.name))
              .map((person, index) => (
                <PersonCard
                  key={person.name}
                  name={person.name}
                  emoji={person.emoji}
                  onClick={() => handleCardClick(person)}
                  delay={200 + index * 150}
                />
              ))}
          </div>
        )}
        
        {/* Show message if all letters are opened */}
        {!isLoading && openedLetters.length === people.length && (
          <div className="text-center mt-12" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <p className="text-muted-foreground text-base font-light">
              All letters have been opened! 🎄✨
            </p>
          </div>
        )}

        {/* Footer decoration */}
        <div className="mt-20 text-center opacity-0 animate-fade-in" style={{ animationDelay: "1s", fontFamily: 'Poppins, sans-serif' }}>
          <div className="text-muted-foreground text-xs font-light">
            Made with ❤️ for a magical Christmas 2024
          </div>
        </div>
      </div>

      {/* Password Modal */}
      <PasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        personName={selectedPerson?.name || ""}
        correctPassword={selectedPerson?.password || ""}
        onSuccess={handlePasswordSuccess}
      />
    </div>
  );
};

export default Index;

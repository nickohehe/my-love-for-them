import { useEffect, useState } from "react";

interface Snowflake {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  character: string;
}

const snowflakeChars = ["❄", "❅", "❆", "✻", "✼", "❉"];

const Snowfall = () => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const flakes: Snowflake[] = [];
    const count = 50;

    for (let i = 0; i < count; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 1.2 + 0.6,
        duration: Math.random() * 8 + 8,
        delay: Math.random() * -15,
        character: snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)],
      });
    }

    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {snowflakes.map((flake) => (
        <span
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            fontSize: `${flake.size}rem`,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
            opacity: 0.7,
          }}
        >
          {flake.character}
        </span>
      ))}
    </div>
  );
};

export default Snowfall;

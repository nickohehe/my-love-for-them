const ChristmasDecorations = () => {
  return (
    <>
      {/* Top decorative lights */}
      <div className="fixed top-0 left-0 right-0 h-8 flex justify-around items-center z-20 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full animate-twinkle"
            style={{
              backgroundColor: i % 4 === 0 ? 'hsl(var(--christmas-red))' : 
                              i % 4 === 1 ? 'hsl(var(--christmas-gold))' : 
                              i % 4 === 2 ? 'hsl(var(--christmas-green))' : 
                              'hsl(var(--christmas-snow))',
              animationDelay: `${i * 0.2}s`,
              boxShadow: `0 0 10px currentColor`,
            }}
          />
        ))}
      </div>

      {/* Corner decorations */}
      <div className="fixed bottom-4 left-4 text-6xl opacity-30 pointer-events-none z-5 animate-float">
        🎄
      </div>
      <div className="fixed bottom-4 right-4 text-6xl opacity-30 pointer-events-none z-5 animate-float" style={{ animationDelay: '1s' }}>
        ⛄
      </div>
      <div className="fixed top-20 left-4 text-4xl opacity-20 pointer-events-none z-5 animate-float" style={{ animationDelay: '0.5s' }}>
        🎁
      </div>
      <div className="fixed top-20 right-4 text-4xl opacity-20 pointer-events-none z-5 animate-float" style={{ animationDelay: '1.5s' }}>
        🔔
      </div>
    </>
  );
};

export default ChristmasDecorations;

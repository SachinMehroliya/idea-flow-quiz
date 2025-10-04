import { useEffect, useState } from 'react';

export function Confetti() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate random confetti particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      color: [
        'hsl(270, 95%, 65%)',
        'hsl(340, 100%, 65%)',
        'hsl(200, 100%, 60%)',
        'hsl(145, 80%, 42%)',
        'hsl(50, 100%, 60%)',
      ][Math.floor(Math.random() * 5)],
    }));

    setParticles(newParticles);

    // Clean up after animations complete
    const timer = setTimeout(() => {
      setParticles([]);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute top-0 w-3 h-3 rounded-full opacity-0"
          style={{
            left: `${particle.left}%`,
            backgroundColor: particle.color,
            animation: `confetti-fall ${particle.duration}s ease-out ${particle.delay}s forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

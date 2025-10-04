import { Card } from '@/components/ui/card';

export function TopicCard({ topic, icon, isSelected, onClick }) {
  return (
    <Card
      className={`card-elevated cursor-pointer p-8 text-center transition-all duration-300 ${
        isSelected
          ? 'ring-4 ring-primary shadow-glow-lg scale-105 bg-gradient-to-br from-primary/5 to-accent/5'
          : 'hover:scale-105'
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-pressed={isSelected}
    >
      <div className="text-6xl mb-4 topic-icon">{icon}</div>
      <h3 className="text-xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        {topic}
      </h3>
    </Card>
  );
}

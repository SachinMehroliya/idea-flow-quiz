import { Card } from '@/components/ui/card';

export function TopicCard({ topic, icon, isSelected, onClick }) {
  return (
    <Card
      className={`card-elevated cursor-pointer p-6 text-center transition-all duration-300 ${
        isSelected
          ? 'ring-2 ring-primary scale-105'
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
      <div className="text-5xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-foreground">{topic}</h3>
    </Card>
  );
}

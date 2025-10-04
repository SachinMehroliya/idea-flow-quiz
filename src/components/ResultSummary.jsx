import { Card } from '@/components/ui/card';
import { Trophy, Star, Target } from 'lucide-react';

export function ResultSummary({ score, total, feedback }) {
  const percentage = (score / total) * 100;
  
  const getGrade = () => {
    if (percentage >= 80) return { 
      icon: Trophy, 
      text: 'Outstanding!', 
      gradient: 'from-success via-success-light to-success',
      glow: 'shadow-[0_0_80px_hsl(145_80%_42%/0.6)]'
    };
    if (percentage >= 60) return { 
      icon: Star, 
      text: 'Great Work!', 
      gradient: 'from-primary via-primary-light to-accent',
      glow: 'shadow-glow-lg'
    };
    return { 
      icon: Target, 
      text: 'Keep Going!', 
      gradient: 'from-secondary via-secondary-light to-accent',
      glow: 'shadow-[0_0_80px_hsl(340_100%_65%/0.6)]'
    };
  };

  const grade = getGrade();
  const GradeIcon = grade.icon;

  return (
    <Card className="card-elevated p-12 text-center animate-scale-in shadow-glow-lg">
      <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${grade.gradient} ${grade.glow} mb-8 float-animation`}>
        <GradeIcon className="w-16 h-16 text-white drop-shadow-lg" />
      </div>

      <h2 className={`text-5xl font-black mb-4 bg-gradient-to-r ${grade.gradient} bg-clip-text text-transparent`}>
        {grade.text}
      </h2>

      <div className="text-7xl font-black bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-6">
        {score}/{total}
      </div>

      <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 text-xl font-bold text-foreground mb-8">
        {percentage.toFixed(0)}% Correct
      </div>

      {feedback && (
        <div className="mt-8 p-8 bg-gradient-to-br from-muted to-muted/50 rounded-2xl text-left animate-slide-up border border-border/50" aria-live="polite">
          <h3 className="text-base font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3 flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-r from-primary to-accent animate-pulse"></span>
            Personalized Feedback
          </h3>
          <p className="text-lg text-foreground leading-relaxed">{feedback}</p>
        </div>
      )}
    </Card>
  );
}

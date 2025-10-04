import { Card } from '@/components/ui/card';
import { Trophy, Star, Target } from 'lucide-react';

export function ResultSummary({ score, total, feedback }) {
  const percentage = (score / total) * 100;
  
  const getGrade = () => {
    if (percentage >= 80) return { icon: Trophy, text: 'Excellent!', color: 'text-success' };
    if (percentage >= 60) return { icon: Star, text: 'Good Job!', color: 'text-primary' };
    return { icon: Target, text: 'Keep Learning!', color: 'text-secondary' };
  };

  const grade = getGrade();
  const GradeIcon = grade.icon;

  return (
    <Card className="card-elevated p-8 text-center animate-scale-in">
      <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-dark mb-6`}>
        <GradeIcon className="w-12 h-12 text-primary-foreground" />
      </div>

      <h2 className={`text-3xl font-bold mb-2 ${grade.color}`}>
        {grade.text}
      </h2>

      <div className="text-5xl font-bold text-foreground mb-4">
        {score}/{total}
      </div>

      <div className="text-lg text-muted-foreground mb-6">
        {percentage.toFixed(0)}% Correct
      </div>

      {feedback && (
        <div className="mt-6 p-6 bg-muted rounded-lg text-left animate-slide-up" aria-live="polite">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">
            Personalized Feedback
          </h3>
          <p className="text-foreground leading-relaxed">{feedback}</p>
        </div>
      )}
    </Card>
  );
}

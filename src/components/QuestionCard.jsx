import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export function QuestionCard({
  question,
  index,
  total,
  selectedIndex,
  onSelect,
  showCorrect = false,
  disabled = false,
}) {
  const getOptionClassName = (optionIndex) => {
    const baseClasses = 'flex items-center space-x-4 p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer';
    
    if (showCorrect) {
      if (optionIndex === question.correctIndex) {
        return `${baseClasses} bg-gradient-to-r from-success/20 to-success/10 border-success shadow-md`;
      }
      if (optionIndex === selectedIndex && selectedIndex !== question.correctIndex) {
        return `${baseClasses} bg-gradient-to-r from-destructive/20 to-destructive/10 border-destructive shadow-md`;
      }
      return `${baseClasses} border-border/40 opacity-50`;
    }

    if (selectedIndex === optionIndex) {
      return `${baseClasses} bg-gradient-to-r from-primary/15 to-accent/10 border-primary shadow-glow scale-105`;
    }

    return `${baseClasses} border-border/50 hover:border-primary hover:shadow-lg hover:scale-102 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent`;
  };

  return (
    <Card className="card-elevated p-10 animate-fade-in shadow-glow">
      <div className="mb-8">
        <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 text-sm font-bold text-primary mb-4">
          Question {index + 1} of {total}
        </div>
        <h2 className="text-3xl font-bold text-foreground leading-tight">
          {question.question}
        </h2>
      </div>

      <RadioGroup
        value={selectedIndex !== undefined ? selectedIndex.toString() : undefined}
        onValueChange={(value) => !disabled && onSelect(parseInt(value))}
        disabled={disabled}
        aria-label="Answer options"
      >
        <fieldset className="space-y-3">
          <legend className="sr-only">Select your answer</legend>
          {question.options.map((option, optionIndex) => (
            <div key={optionIndex} className={getOptionClassName(optionIndex)}>
              <RadioGroupItem
                value={optionIndex.toString()}
                id={`option-${optionIndex}`}
                className="mt-0"
                disabled={disabled}
              />
              <Label
                htmlFor={`option-${optionIndex}`}
                className="flex-1 cursor-pointer text-base"
              >
                {option}
              </Label>
              {showCorrect && optionIndex === question.correctIndex && (
                <span className="text-success font-semibold text-sm">✓ Correct</span>
              )}
              {showCorrect && optionIndex === selectedIndex && selectedIndex !== question.correctIndex && (
                <span className="text-destructive font-semibold text-sm">✗ Wrong</span>
              )}
            </div>
          ))}
        </fieldset>
      </RadioGroup>

      {showCorrect && question.explanation && (
        <div className="mt-8 p-6 bg-gradient-to-r from-muted to-muted/50 rounded-xl animate-slide-up border-l-4 border-primary">
          <h4 className="font-bold text-sm text-primary mb-2 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Explanation
          </h4>
          <p className="text-foreground leading-relaxed">{question.explanation}</p>
        </div>
      )}
    </Card>
  );
}

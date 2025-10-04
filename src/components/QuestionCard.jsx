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
    const baseClasses = 'flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer';
    
    if (showCorrect) {
      if (optionIndex === question.correctIndex) {
        return `${baseClasses} bg-success/10 border-success`;
      }
      if (optionIndex === selectedIndex && selectedIndex !== question.correctIndex) {
        return `${baseClasses} bg-destructive/10 border-destructive`;
      }
      return `${baseClasses} border-border opacity-60`;
    }

    if (selectedIndex === optionIndex) {
      return `${baseClasses} bg-primary/10 border-primary`;
    }

    return `${baseClasses} border-border hover:border-primary/50 hover:bg-primary/5`;
  };

  return (
    <Card className="card-elevated p-8 animate-fade-in">
      <div className="mb-6">
        <div className="text-sm text-muted-foreground mb-2">
          Question {index + 1} of {total}
        </div>
        <h2 className="text-2xl font-semibold text-foreground leading-tight">
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
        <div className="mt-6 p-4 bg-muted rounded-lg animate-slide-up">
          <h4 className="font-semibold text-sm text-muted-foreground mb-1">Explanation</h4>
          <p className="text-foreground">{question.explanation}</p>
        </div>
      )}
    </Card>
  );
}

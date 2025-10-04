import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { QuestionCard } from '@/components/QuestionCard';
import { ProgressBar } from '@/components/ProgressBar';
import { useQuiz } from '@/context/QuizContext';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

export function QuizScreen() {
  const { state, dispatch, actions } = useQuiz();
  const { questions, answers, currentQuestionIndex } = state;
  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestion?.id];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const canGoNext = selectedAnswer !== undefined;
  const canGoPrevious = currentQuestionIndex > 0;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft' && canGoPrevious) {
        dispatch({ type: actions.PREVIOUS_QUESTION });
      } else if (e.key === 'ArrowRight' && canGoNext) {
        if (isLastQuestion) {
          handleSubmit();
        } else {
          dispatch({ type: actions.NEXT_QUESTION });
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [canGoPrevious, canGoNext, isLastQuestion, dispatch, actions]);

  const handleSelectAnswer = (optionIndex) => {
    dispatch({
      type: actions.SELECT_ANSWER,
      payload: {
        questionId: currentQuestion.id,
        optionIndex,
      },
    });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      dispatch({ type: actions.NEXT_QUESTION });
    }
  };

  const handlePrevious = () => {
    dispatch({ type: actions.PREVIOUS_QUESTION });
  };

  const handleSubmit = () => {
    dispatch({ type: actions.SUBMIT_QUIZ });
  };

  if (!currentQuestion) return null;

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen py-12 px-4 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <ProgressBar current={answeredCount} total={questions.length} />
        </div>

        <QuestionCard
          question={currentQuestion}
          index={currentQuestionIndex}
          total={questions.length}
          selectedIndex={selectedAnswer}
          onSelect={handleSelectAnswer}
        />

        <nav className="flex justify-between items-center mt-8" aria-label="Quiz navigation">
          <Button
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            variant="outline"
            size="lg"
            className="min-w-32"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            Use ← → arrow keys to navigate
          </div>

          <Button
            onClick={handleNext}
            disabled={!canGoNext}
            size="lg"
            className="btn-gradient min-w-32"
          >
            {isLastQuestion ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Submit
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </nav>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ResultSummary } from '@/components/ResultSummary';
import { QuestionCard } from '@/components/QuestionCard';
import { useQuiz } from '@/context/QuizContext';
import { generateFeedback } from '@/services/aiService';
import { Home, ChevronDown, ChevronUp } from 'lucide-react';

export function ResultScreen() {
  const { state, dispatch, actions } = useQuiz();
  const { questions, answers, feedback } = state;
  const [showReview, setShowReview] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(true);

  // Calculate score
  const score = questions.reduce((acc, question) => {
    const userAnswer = answers[question.id];
    return userAnswer === question.correctIndex ? acc + 1 : acc;
  }, 0);

  // Generate AI feedback on mount
  useEffect(() => {
    async function fetchFeedback() {
      try {
        const result = await generateFeedback({
          score,
          total: questions.length,
          answers,
        });
        dispatch({ type: actions.SET_FEEDBACK, payload: result.feedback });
      } catch (error) {
        console.error('Failed to generate feedback:', error);
        // Fallback feedback is handled in the service
      } finally {
        setLoadingFeedback(false);
      }
    }

    if (!feedback) {
      fetchFeedback();
    } else {
      setLoadingFeedback(false);
    }
  }, []);

  const handleReset = () => {
    dispatch({ type: actions.RESET_QUIZ });
  };

  return (
    <div className="min-h-screen py-12 px-4 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <ResultSummary
          score={score}
          total={questions.length}
          feedback={loadingFeedback ? 'Generating personalized feedback...' : feedback}
        />

        <div className="mt-8">
          <button
            onClick={() => setShowReview(!showReview)}
            className="w-full flex items-center justify-between p-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            aria-expanded={showReview}
          >
            <span className="font-semibold text-foreground">
              {showReview ? 'Hide' : 'Review'} Your Answers
            </span>
            {showReview ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>

          {showReview && (
            <div className="space-y-6 mt-6 animate-slide-up">
              {questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  index={index}
                  total={questions.length}
                  selectedIndex={answers[question.id]}
                  showCorrect={true}
                  disabled={true}
                />
              ))}
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <Button onClick={handleReset} size="lg" className="btn-gradient">
            <Home className="w-5 h-5 mr-2" />
            Take Another Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}

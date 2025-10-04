import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ResultSummary } from '@/components/ResultSummary';
import { QuestionCard } from '@/components/QuestionCard';
import { useQuiz } from '@/context/QuizContext';
import { generateFeedback } from '@/services/aiService';
import { Confetti } from '@/components/Confetti';
import { Home, ChevronDown, ChevronUp } from 'lucide-react';

export function ResultScreen() {
  const { state, dispatch, actions } = useQuiz();
  const { questions, answers, feedback } = state;
  const [showReview, setShowReview] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);

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
    setShowConfetti(false);
    dispatch({ type: actions.RESET_QUIZ });
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen py-16 px-4 animate-fade-in">
      {showConfetti && score >= questions.length * 0.6 && <Confetti />}
      <div className="max-w-4xl mx-auto">
        <ResultSummary
          score={score}
          total={questions.length}
          feedback={loadingFeedback ? 'Generating personalized feedback...' : feedback}
        />

        <div className="mt-10">
          <button
            onClick={() => setShowReview(!showReview)}
            className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-muted to-muted/50 hover:from-primary/10 hover:to-accent/10 rounded-2xl transition-all duration-300 border-2 border-border hover:border-primary shadow-md hover:shadow-lg"
            aria-expanded={showReview}
          >
            <span className="font-bold text-lg text-foreground">
              {showReview ? 'Hide' : 'Review'} Your Answers
            </span>
            {showReview ? (
              <ChevronUp className="w-6 h-6 text-primary" />
            ) : (
              <ChevronDown className="w-6 h-6 text-primary" />
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

        <div className="text-center mt-10">
          <Button onClick={handleReset} size="lg" className="btn-hero text-xl px-12 py-8 font-bold rounded-2xl">
            <Home className="w-6 h-6 mr-3" />
            Take Another Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}

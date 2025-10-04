import { QuizProvider, useQuiz, QUIZ_STATES } from '@/context/QuizContext';
import { TopicSelection } from '@/screens/TopicSelection';
import { QuizScreen } from '@/screens/QuizScreen';
import { ResultScreen } from '@/screens/ResultScreen';
import { Loader } from '@/components/Loader';
import { ErrorBanner } from '@/components/ErrorBanner';
import { generateQuestions } from '@/services/aiService';

function QuizApp() {
  const { state, dispatch, actions } = useQuiz();

  const handleRetry = async () => {
    if (!state.selectedTopic) return;

    dispatch({ type: actions.START_GENERATION });

    try {
      const result = await generateQuestions(state.selectedTopic.name);
      dispatch({ type: actions.GENERATION_SUCCESS, payload: result.questions });
    } catch (error) {
      console.error('Error generating quiz:', error);
      dispatch({ type: actions.GENERATION_ERROR, payload: error.message });
    }
  };

  switch (state.state) {
    case QUIZ_STATES.TOPIC_SELECTION:
      return <TopicSelection />;

    case QUIZ_STATES.GENERATING:
      return <Loader message="Generating your personalized quiz..." />;

    case QUIZ_STATES.QUIZ_ACTIVE:
      return <QuizScreen />;

    case QUIZ_STATES.RESULTS:
      return <ResultScreen />;

    case QUIZ_STATES.ERROR:
      return (
        <div className="min-h-screen py-12 px-4 flex items-center justify-center">
          <div className="max-w-2xl w-full">
            <ErrorBanner error={state.error} onRetry={handleRetry} />
          </div>
        </div>
      );

    default:
      return null;
  }
}

const Index = () => {
  return (
    <QuizProvider>
      <QuizApp />
    </QuizProvider>
  );
};

export default Index;

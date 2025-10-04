import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TopicCard } from '@/components/TopicCard';
import { useQuiz } from '@/context/QuizContext';
import { generateQuestions } from '@/services/aiService';
import { Sparkles } from 'lucide-react';

const TOPICS = [
  { id: 'wellness', name: 'Wellness', icon: '🧘' },
  { id: 'tech', name: 'Tech Trends', icon: '💻' },
  { id: 'history', name: 'History', icon: '📚' },
  { id: 'science', name: 'Science', icon: '🔬' },
  { id: 'geography', name: 'Geography', icon: '🌍' },
  { id: 'arts', name: 'Arts & Culture', icon: '🎨' },
];

export function TopicSelection() {
  const { dispatch, actions } = useQuiz();
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    dispatch({ type: actions.SELECT_TOPIC, payload: topic });
  };

  const handleGenerateQuiz = async () => {
    if (!selectedTopic) return;

    dispatch({ type: actions.START_GENERATION });

    try {
      const result = await generateQuestions(selectedTopic.name);
      dispatch({ type: actions.GENERATION_SUCCESS, payload: result.questions });
    } catch (error) {
      console.error('Error generating quiz:', error);
      dispatch({ type: actions.GENERATION_ERROR, payload: error.message });
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16 space-y-6">
          <div className="inline-block animate-float">
            <span className="text-7xl">🎯</span>
          </div>
          <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent drop-shadow-2xl">
            AI Knowledge Quiz
          </h1>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto font-medium">
            Choose your favorite topic and challenge yourself with
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-bold"> AI-powered questions</span>
          </p>
        </header>

        <main>
          <section aria-labelledby="topic-selection-heading">
            <h2 id="topic-selection-heading" className="sr-only">
              Select a topic
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {TOPICS.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic.name}
                  icon={topic.icon}
                  isSelected={selectedTopic?.id === topic.id}
                  onClick={() => handleTopicSelect(topic)}
                />
              ))}
            </div>
          </section>

          <div className="text-center">
            <Button
              onClick={handleGenerateQuiz}
              disabled={!selectedTopic}
              size="lg"
              className="btn-hero text-xl px-12 py-8 disabled:opacity-30 disabled:cursor-not-allowed font-bold rounded-2xl"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              Generate My Quiz
            </Button>
            {!selectedTopic && (
              <p className="text-sm text-muted-foreground mt-4 animate-pulse">
                👆 Select a topic above to continue
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

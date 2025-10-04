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
    <div className="min-h-screen py-12 px-4 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent">
            AI-Assisted Knowledge Quiz
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose a topic and test your knowledge with AI-generated questions
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
              className="btn-gradient text-lg px-8 py-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Quiz
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}

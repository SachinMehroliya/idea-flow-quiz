/**
 * AI Service for generating quiz questions and feedback
 * Implements retry logic and JSON validation
 */

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Mock AI endpoint - replace with real API in production
const AI_ENDPOINT = '/api/ai'; // This would be your actual AI API endpoint

/**
 * Sample prompt for AI to generate quiz questions
 */
const QUESTION_GENERATION_PROMPT = `You are an assistant that only answers with JSON following this schema:
{
  "status":"ok",
  "topic":"<topic name>",
  "questions":[
    {
      "id":"q1",
      "question":"<question text>",
      "options":["opt1","opt2","opt3","opt4"],
      "correctIndex": <index 0-based>,
      "explanation":"<optional short explanation>"
    }
    ... total exactly 5 objects ...
  ]
}
Rules:
- Return exactly the JSON object and nothing else (no markdown, no commentary).
- Use clear, concise language in questions and explanations.
- Provide exactly 5 questions for the asked topic.
- If unable to generate, return {"status":"error","message":"brief reason"}.

Now: generate 5 MCQs for the topic: "__TOPIC_PLACEHOLDER__".`;

/**
 * Validates the AI response for quiz questions
 */
function validateQuestionResponse(response) {
  if (!response || typeof response !== 'object') {
    return { valid: false, error: 'Response is not an object' };
  }

  if (response.status === 'error') {
    return { valid: false, error: response.message || 'AI returned error status' };
  }

  if (response.status !== 'ok') {
    return { valid: false, error: 'Invalid status field' };
  }

  if (typeof response.topic !== 'string' || response.topic.length === 0) {
    return { valid: false, error: 'Invalid topic field' };
  }

  if (!Array.isArray(response.questions)) {
    return { valid: false, error: 'Questions is not an array' };
  }

  if (response.questions.length !== 5) {
    return { valid: false, error: `Expected 5 questions, got ${response.questions.length}` };
  }

  // Validate each question
  for (let i = 0; i < response.questions.length; i++) {
    const q = response.questions[i];
    
    if (typeof q.id !== 'string' || q.id.length === 0) {
      return { valid: false, error: `Question ${i}: Invalid id` };
    }

    if (typeof q.question !== 'string' || q.question.length < 10) {
      return { valid: false, error: `Question ${i}: Question text too short` };
    }

    if (!Array.isArray(q.options) || q.options.length < 2) {
      return { valid: false, error: `Question ${i}: Need at least 2 options` };
    }

    if (!Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
      return { valid: false, error: `Question ${i}: Invalid correctIndex` };
    }

    if (q.explanation !== undefined && typeof q.explanation !== 'string') {
      return { valid: false, error: `Question ${i}: Invalid explanation type` };
    }
  }

  return { valid: true };
}

/**
 * Validates feedback response from AI
 */
function validateFeedbackResponse(response) {
  if (!response || typeof response !== 'object') {
    return { valid: false, error: 'Response is not an object' };
  }

  if (response.status === 'error') {
    return { valid: false, error: response.message || 'AI returned error status' };
  }

  if (typeof response.feedback !== 'string' || response.feedback.length < 10) {
    return { valid: false, error: 'Invalid feedback field' };
  }

  return { valid: true };
}

/**
 * Mock AI call - replace with actual API call
 */
async function mockAICall(prompt) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Extract topic from prompt
  const topicMatch = prompt.match(/topic: "([^"]+)"/);
  const topic = topicMatch ? topicMatch[1] : 'General Knowledge';

  // Check if it's a feedback request
  if (prompt.includes('feedback')) {
    return {
      status: 'ok',
      feedback: 'Great job! You demonstrated solid understanding of the topic. Keep up the good work and continue learning!'
    };
  }

  // Mock question generation
  const mockQuestions = {
    status: 'ok',
    topic: topic,
    questions: [
      {
        id: 'q1',
        question: `What is a key concept in ${topic}?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctIndex: 1,
        explanation: 'This is the correct answer because it best represents the concept.'
      },
      {
        id: 'q2',
        question: `Which statement is true about ${topic}?`,
        options: ['Statement 1', 'Statement 2', 'Statement 3', 'Statement 4'],
        correctIndex: 2,
        explanation: 'This statement accurately describes the principle.'
      },
      {
        id: 'q3',
        question: `How does ${topic} relate to modern applications?`,
        options: ['Method A', 'Method B', 'Method C', 'Method D'],
        correctIndex: 0,
        explanation: 'This method is most commonly used in practice.'
      },
      {
        id: 'q4',
        question: `What is the main benefit of understanding ${topic}?`,
        options: ['Benefit A', 'Benefit B', 'Benefit C', 'Benefit D'],
        correctIndex: 3,
        explanation: 'This benefit provides the most value.'
      },
      {
        id: 'q5',
        question: `Which approach is recommended for ${topic}?`,
        options: ['Approach 1', 'Approach 2', 'Approach 3', 'Approach 4'],
        correctIndex: 1,
        explanation: 'This approach follows best practices.'
      }
    ]
  };

  return mockQuestions;
}

/**
 * Delays execution for retry logic
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate quiz questions for a given topic
 * Implements retry logic with exponential backoff
 */
export async function generateQuestions(topic) {
  let lastError = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      console.log(`Generating questions for "${topic}" (attempt ${attempt + 1}/${MAX_RETRIES})`);

      const prompt = QUESTION_GENERATION_PROMPT.replace('__TOPIC_PLACEHOLDER__', topic);
      
      // In production, replace mockAICall with actual API call:
      // const response = await fetch(AI_ENDPOINT, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ prompt })
      // });
      // const data = await response.json();

      const data = await mockAICall(prompt);

      // Validate response
      const validation = validateQuestionResponse(data);
      
      if (!validation.valid) {
        lastError = new Error(`Validation failed: ${validation.error}`);
        console.warn(`Attempt ${attempt + 1} validation failed:`, validation.error);
        
        if (attempt < MAX_RETRIES - 1) {
          await delay(RETRY_DELAY * (attempt + 1)); // Exponential backoff
          continue;
        }
      } else {
        console.log('Questions generated successfully');
        return data;
      }
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt + 1} failed:`, error);
      
      if (attempt < MAX_RETRIES - 1) {
        await delay(RETRY_DELAY * (attempt + 1));
      }
    }
  }

  // All retries failed
  throw new Error(`Failed to generate questions after ${MAX_RETRIES} attempts: ${lastError?.message}`);
}

/**
 * Generate personalized feedback based on quiz results
 */
export async function generateFeedback({ score, total, answers }) {
  try {
    console.log(`Generating feedback for score: ${score}/${total}`);

    const percentage = (score / total) * 100;
    const prompt = `Generate encouraging and personalized feedback for a quiz taker who scored ${score} out of ${total} (${percentage.toFixed(1)}%). 
    Keep the feedback positive, specific, and motivating. Return JSON: {"status":"ok","feedback":"your feedback message here"}`;

    // In production, use actual API call
    const data = await mockAICall(prompt);

    const validation = validateFeedbackResponse(data);
    
    if (!validation.valid) {
      // Fallback to generic feedback
      return {
        status: 'ok',
        feedback: `You scored ${score} out of ${total}! ${
          percentage >= 80 ? 'Excellent work!' : 
          percentage >= 60 ? 'Good job! Keep learning!' : 
          'Keep practicing and you\'ll improve!'
        }`
      };
    }

    return data;
  } catch (error) {
    console.error('Failed to generate feedback:', error);
    // Return fallback feedback
    return {
      status: 'ok',
      feedback: `You completed the quiz with a score of ${score}/${total}. Great effort!`
    };
  }
}

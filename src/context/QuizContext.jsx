import { createContext, useContext, useReducer } from 'react';

// Quiz states
export const QUIZ_STATES = {
  TOPIC_SELECTION: 'TOPIC_SELECTION',
  GENERATING: 'GENERATING',
  QUIZ_ACTIVE: 'QUIZ_ACTIVE',
  RESULTS: 'RESULTS',
  ERROR: 'ERROR',
};

// Initial state
const initialState = {
  state: QUIZ_STATES.TOPIC_SELECTION,
  selectedTopic: null,
  questions: [],
  answers: {}, // { questionId: selectedOptionIndex }
  currentQuestionIndex: 0,
  loading: false,
  error: null,
  feedback: null,
};

// Action types
const ACTIONS = {
  SELECT_TOPIC: 'SELECT_TOPIC',
  START_GENERATION: 'START_GENERATION',
  GENERATION_SUCCESS: 'GENERATION_SUCCESS',
  GENERATION_ERROR: 'GENERATION_ERROR',
  SELECT_ANSWER: 'SELECT_ANSWER',
  NEXT_QUESTION: 'NEXT_QUESTION',
  PREVIOUS_QUESTION: 'PREVIOUS_QUESTION',
  SUBMIT_QUIZ: 'SUBMIT_QUIZ',
  SET_FEEDBACK: 'SET_FEEDBACK',
  RESET_QUIZ: 'RESET_QUIZ',
};

// Reducer
function quizReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SELECT_TOPIC:
      return {
        ...state,
        selectedTopic: action.payload,
      };

    case ACTIONS.START_GENERATION:
      return {
        ...state,
        state: QUIZ_STATES.GENERATING,
        loading: true,
        error: null,
      };

    case ACTIONS.GENERATION_SUCCESS:
      return {
        ...state,
        state: QUIZ_STATES.QUIZ_ACTIVE,
        questions: action.payload,
        loading: false,
        error: null,
        currentQuestionIndex: 0,
        answers: {},
      };

    case ACTIONS.GENERATION_ERROR:
      return {
        ...state,
        state: QUIZ_STATES.ERROR,
        loading: false,
        error: action.payload,
      };

    case ACTIONS.SELECT_ANSWER:
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: action.payload.optionIndex,
        },
      };

    case ACTIONS.NEXT_QUESTION:
      return {
        ...state,
        currentQuestionIndex: Math.min(
          state.currentQuestionIndex + 1,
          state.questions.length - 1
        ),
      };

    case ACTIONS.PREVIOUS_QUESTION:
      return {
        ...state,
        currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
      };

    case ACTIONS.SUBMIT_QUIZ:
      return {
        ...state,
        state: QUIZ_STATES.RESULTS,
      };

    case ACTIONS.SET_FEEDBACK:
      return {
        ...state,
        feedback: action.payload,
      };

    case ACTIONS.RESET_QUIZ:
      return initialState;

    default:
      return state;
  }
}

// Context
const QuizContext = createContext(null);

// Provider component
export function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const value = {
    state,
    dispatch,
    actions: ACTIONS,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

// Custom hook
export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider');
  }
  return context;
}

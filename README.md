# AI-Assisted Knowledge Quiz

A beautiful, accessible, and responsive web application for taking AI-generated knowledge quizzes. Built with React, JavaScript, and Tailwind CSS.

## 🎯 Project Overview

This application demonstrates the integration of AI-powered question generation with a polished user interface. Users can select from various topics, take a 5-question quiz, and receive personalized feedback based on their performance.

### Key Features

- 🎨 Modern, responsive design with smooth animations
- 🤖 AI-generated quiz questions and personalized feedback
- ♿ Full accessibility support (ARIA labels, keyboard navigation)
- 🔄 Robust error handling with automatic retry logic
- 📱 Mobile-first responsive layout
- ⌨️ Keyboard shortcuts (Arrow keys for navigation)
- 📊 Visual progress tracking

## 🚀 Project Setup & Demo

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
```

## 🧠 Problem Understanding

### Requirements Analysis

The application needed to solve several key challenges:

1. **AI Integration**: Reliably call AI services to generate quiz questions and feedback
2. **Data Validation**: Ensure AI responses match expected JSON schema
3. **Error Resilience**: Handle API failures gracefully with retry logic
4. **User Experience**: Provide smooth, intuitive navigation with visual feedback
5. **Accessibility**: Support keyboard navigation and screen readers

### Assumptions

- AI endpoint would occasionally return malformed JSON (handled with validation + retry)
- Users might have slow connections (implemented loading states)
- Quiz should be completable in 5-10 minutes (5 questions)
- Mobile users are primary audience (mobile-first design)

## 🤖 AI Prompts & Iterations

### Initial Prompt for Question Generation

```
You are an assistant that only answers with JSON following this schema:
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
- Return exactly the JSON object and nothing else
- Use clear, concise language
- Provide exactly 5 questions for the asked topic
- If unable to generate, return {"status":"error","message":"brief reason"}

Now: generate 5 MCQs for the topic: "[TOPIC]".
```

### Iterations & Improvements

1. **v1**: Basic prompt → AI sometimes returned markdown wrapped JSON
2. **v2**: Added "no markdown" instruction → Improved but still occasional failures
3. **v3**: Added validation + retry logic in code → Robust handling of edge cases
4. **v4**: Current implementation with exponential backoff

### Feedback Prompt

```
Generate encouraging and personalized feedback for a quiz taker who scored X out of Y.
Keep the feedback positive, specific, and motivating.
Return JSON: {"status":"ok","feedback":"your feedback message here"}
```

## 🏗️ Architecture & Code Structure

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── TopicCard.jsx       # Topic selection card
│   ├── QuestionCard.jsx    # Quiz question display
│   ├── ProgressBar.jsx     # Visual progress indicator
│   ├── Loader.jsx          # Loading state component
│   ├── ErrorBanner.jsx     # Error display with retry
│   └── ResultSummary.jsx   # Final score and feedback
│
├── context/            # State management
│   └── QuizContext.jsx     # Global quiz state with useReducer
│
├── screens/           # Main application screens
│   ├── TopicSelection.jsx  # Screen 1: Choose topic
│   ├── QuizScreen.jsx      # Screen 2: Take quiz
│   └── ResultScreen.jsx    # Screen 3: View results
│
├── services/          # External integrations
│   └── aiService.js        # AI API calls with validation
│
└── pages/
    └── Index.tsx           # Main app entry point
```

### State Management

Using React Context + useReducer pattern:

```javascript
State Shape:
{
  state: 'TOPIC_SELECTION' | 'GENERATING' | 'QUIZ_ACTIVE' | 'RESULTS' | 'ERROR',
  selectedTopic: { id, name, icon },
  questions: [...],
  answers: { questionId: selectedOptionIndex },
  currentQuestionIndex: number,
  loading: boolean,
  error: string | null,
  feedback: string | null
}
```

### Key Components

#### QuestionCard
- **Props**: `question`, `index`, `total`, `selectedIndex`, `onSelect`, `showCorrect`, `disabled`
- **Features**: Radio group, visual feedback, explanations
- **Accessibility**: Fieldset, ARIA labels, keyboard support

#### AI Service
- **Functions**: `generateQuestions(topic)`, `generateFeedback({score, total, answers})`
- **Validation**: Checks JSON structure, field types, array lengths
- **Retry Logic**: 3 attempts with exponential backoff (1s, 2s, 3s)

### Design System

All colors and styles use HSL semantic tokens from `index.css`:

```css
--primary: 262 83% 58%        /* Vibrant purple */
--secondary: 340 82% 67%       /* Coral accent */
--success: 142 76% 36%         /* Green for correct */
--gradient-primary: linear-gradient(...)
```

Components use design tokens (never hardcoded colors):
```jsx
// ❌ Don't do this
<Button className="bg-purple-600">

// ✅ Do this
<Button className="btn-gradient">
```

## 📸 Screenshots / Screen Recording

### How to Capture

1. **Screenshots**: Use browser dev tools or OS screenshot tool
2. **Screen Recording**: Use Loom, OBS, or QuickTime

### Key Screens to Capture

1. Topic selection with hover states
2. Loading screen during AI generation
3. Quiz question with selected answer
4. Results screen with feedback
5. Error state with retry button
6. Mobile responsive views

## 🐛 Known Issues / Improvements

### Current Limitations

1. **Mock AI**: Currently uses mock data (needs real AI API integration)
2. **No persistence**: Quiz state resets on page refresh
3. **Single session**: No user accounts or history tracking
4. **Limited topics**: Only 6 predefined topics

### Future Improvements

1. **Backend Integration**
   - Connect to real AI API (OpenAI, Anthropic, etc.)
   - Add API key management
   - Implement proper error responses

2. **Enhanced Features**
   - User authentication and profiles
   - Quiz history and progress tracking
   - Custom topic creation
   - Difficulty levels
   - Timed quizzes
   - Multiplayer mode

3. **Performance**
   - Question pre-fetching
   - Response caching
   - Progressive Web App (PWA) support

4. **Analytics**
   - Track user performance
   - Popular topics
   - Error rates

## ✨ Bonus Work

### Implemented Extras

1. **Smooth Animations**: Fade-in, scale, and slide transitions
2. **Keyboard Navigation**: Arrow keys for quiz navigation
3. **Visual Feedback**: Progress bar with gradient fill
4. **Accessible Design**: ARIA labels, focus management, semantic HTML
5. **Error Handling**: Detailed error display with toggle
6. **Personalized Feedback**: AI-generated messages based on score

### Technical Enhancements

- Custom design system with semantic tokens
- Reusable component architecture
- Comprehensive validation logic
- Exponential backoff retry mechanism
- Mobile-first responsive design

## 🧪 Testing

### Manual Testing Checklist

- [ ] Topic selection and deselection works
- [ ] Quiz generation shows loader
- [ ] Questions display correctly
- [ ] Answer selection works
- [ ] Navigation (Next/Previous) works
- [ ] Keyboard navigation (arrows) works
- [ ] Submit shows results
- [ ] Score calculation is correct
- [ ] Feedback displays properly
- [ ] Error handling works
- [ ] Retry button functions
- [ ] Reset returns to topic selection
- [ ] Responsive on mobile
- [ ] Accessible with keyboard only
- [ ] Screen reader compatible

### Unit Testing (To Implement)

```bash
# Run tests
npm test

# Test coverage
npm run test:coverage
```

**Test Cases to Add:**

1. **aiService.js**
   - Valid JSON passes validation
   - Invalid JSON fails validation
   - Retry logic attempts correct number of times
   - Error messages are descriptive

2. **QuestionCard**
   - Renders all options
   - Calls onSelect when option clicked
   - Shows correct answer in review mode
   - Handles keyboard events

3. **QuizContext**
   - State transitions work correctly
   - Actions update state properly
   - Score calculation is accurate

## 📚 Technologies Used

- **React 18** - UI library
- **JavaScript (ES6+)** - Programming language
- **Tailwind CSS** - Styling framework
- **Vite** - Build tool
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

## 🤝 Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

---

**Note**: This is a demonstration project. The AI integration uses mock data. To use with a real AI service, replace the `mockAICall` function in `src/services/aiService.js` with actual API calls to your preferred AI provider (OpenAI, Anthropic, Google Gemini, etc.).

For production use:
1. Add proper API key management
2. Implement rate limiting
3. Add authentication
4. Set up database for user data
5. Deploy with proper environment variables

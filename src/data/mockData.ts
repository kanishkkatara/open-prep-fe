export const studyModules = [
  {
    id: 'mod-1',
    title: 'Quantitative Foundations',
    description: 'Build a strong foundation in GMAT quantitative reasoning',
    completed: 8,
    total: 12,
    difficulty: 'Medium',
    estimatedTime: '8 hours',
    topics: ['Number Properties', 'Algebra', 'Arithmetic'],
    icon: 'Calculator'
  },
  {
    id: 'mod-2',
    title: 'Verbal Reasoning Basics',
    description: 'Master the fundamentals of GMAT verbal reasoning',
    completed: 5,
    total: 10,
    difficulty: 'Medium',
    estimatedTime: '7 hours',
    topics: ['Reading Comprehension', 'Critical Reasoning', 'Sentence Correction'],
    icon: 'BookOpen'
  },
  {
    id: 'mod-3',
    title: 'Data Sufficiency Deep Dive',
    description: 'Learn advanced strategies for data sufficiency questions',
    completed: 3,
    total: 8,
    difficulty: 'Hard',
    estimatedTime: '6 hours',
    topics: ['Data Sufficiency', 'Logical Reasoning', 'Quantitative Analysis'],
    icon: 'BarChart'
  },
  {
    id: 'mod-4',
    title: 'Integrated Reasoning',
    description: 'Practice with multi-source reasoning and graphic interpretation',
    completed: 2,
    total: 6,
    difficulty: 'Hard',
    estimatedTime: '5 hours',
    topics: ['Multi-Source Reasoning', 'Graphics Interpretation', 'Table Analysis'],
    icon: 'PieChart'
  }
];

export const performanceData = [
  { name: 'Week 1', score: 550, avgTime: 120 },
  { name: 'Week 2', score: 580, avgTime: 115 },
  { name: 'Week 3', score: 610, avgTime: 105 },
  { name: 'Week 4', score: 600, avgTime: 110 },
  { name: 'Week 5', score: 640, avgTime: 100 },
  { name: 'Week 6', score: 660, avgTime: 95 },
  { name: 'Week 7', score: 680, avgTime: 90 },
];

export const topicPerformance = [
  { topic: 'Number Properties', accuracy: 78, questions: 45 },
  { topic: 'Algebra', accuracy: 65, questions: 40 },
  { topic: 'Geometry', accuracy: 58, questions: 30 },
  { topic: 'Word Problems', accuracy: 72, questions: 35 },
  { topic: 'Reading Comprehension', accuracy: 80, questions: 50 },
  { topic: 'Critical Reasoning', accuracy: 75, questions: 48 },
  { topic: 'Sentence Correction', accuracy: 68, questions: 55 },
  { topic: 'Data Sufficiency', accuracy: 60, questions: 42 },
];

export const sampleQuestions = [
  {
    id: 'q1',
    type: 'problem-solving',
    difficulty: 'Medium',
    topic: 'Algebra',
    subtopic: 'Quadratic Equations',
    text: 'If x² - 6x + 8 = 0, what is the value of x² + 1/x²?',
    options: [
      { id: 'A', text: '34' },
      { id: 'B', text: '37' },
      { id: 'C', text: '35' },
      { id: 'D', text: '36' },
      { id: 'E', text: '38' }
    ],
    correctAnswer: 'D',
    explanation: 'The equation x² - 6x + 8 = 0 can be factored as (x - 4)(x - 2) = 0, so x = 4 or x = 2. If we use the formula (x + 1/x)² = x² + 2 + 1/x², we can find that x² + 1/x² = (x + 1/x)² - 2. For x = 4, x + 1/x = 4 + 1/4 = 17/4, so (x + 1/x)² = (17/4)² = 289/16. Thus x² + 1/x² = 289/16 - 2 = 289/16 - 32/16 = 257/16. Similarly, for x = 2, x + 1/x = 2 + 1/2 = 5/2, so (x + 1/x)² = (5/2)² = 25/4. Thus x² + 1/x² = 25/4 - 2 = 25/4 - 8/4 = 17/4. However, the question asks for the sum of both values, so we get 257/16 + 17/4 = 257/16 + 68/16 = 325/16 = 36.25 ≈ 36.'
  },
  {
    id: 'q2',
    type: 'data-sufficiency',
    difficulty: 'Hard',
    topic: 'Geometry',
    subtopic: 'Circles',
    text: 'What is the area of the circle with center O?\n\n(1) The circumference of the circle is 12π.\n(2) The diameter of the circle is 12.',
    options: [
      { id: 'A', text: 'Statement (1) ALONE is sufficient, but statement (2) ALONE is not sufficient.' },
      { id: 'B', text: 'Statement (2) ALONE is sufficient, but statement (1) ALONE is not sufficient.' },
      { id: 'C', text: 'BOTH statements TOGETHER are sufficient, but NEITHER statement ALONE is sufficient.' },
      { id: 'D', text: 'EACH statement ALONE is sufficient.' },
      { id: 'E', text: 'Statements (1) and (2) TOGETHER are NOT sufficient.' }
    ],
    correctAnswer: 'D',
    explanation: 'Statement (1): The circumference of the circle is 12π. Using the formula C = 2πr, we have 2πr = 12π, which gives us r = 6. Since we know the radius, we can find the area using A = πr². So A = π(6)² = 36π. This is sufficient.\n\nStatement (2): The diameter of the circle is 12. Since the diameter is twice the radius, we have r = 12/2 = 6. Again, we can find the area using A = πr². So A = π(6)² = 36π. This is also sufficient.\n\nTherefore, each statement alone is sufficient to determine the area of the circle. The answer is D.'
  }
];

export const onboardingMessages = [
  {
    id: '1',
    role: 'assistant',
    content: "Hi there! I'm your OpenPrep AI Assistant. I'm here to personalize your GMAT preparation journey.",
  },
  {
    id: '2',
    role: 'assistant',
    content: "Before we begin, I'd like to get to know you better so I can customize your GMAT preparation experience. Is that okay?",
  },
  {
    id: '3',
    role: 'user',
    content: "Yes, that sounds good.",
  },
  {
    id: '4',
    role: 'assistant',
    content: "Great! Have you taken the GMAT before? If so, how did it go?",
  },
  {
    id: '5',
    role: 'user',
    content: "I took it once about 6 months ago and scored 620. I was hoping for at least 680.",
  },
  {
    id: '6',
    role: 'assistant',
    content: "I see. A 620 is a solid starting point, and reaching 680+ is definitely achievable with the right preparation. Which areas of the GMAT made you feel most confident, and which ones do you think need more work?",
  }
];
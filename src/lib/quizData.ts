interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

const questionBank: Record<string, Question[]> = {
  Math: [
    { question: "What is the value of x in 2x + 6 = 14?", options: ["2", "4", "6", "8"], correctIndex: 1 },
    { question: "What is the area of a circle with radius 5?", options: ["25π", "10π", "50π", "15π"], correctIndex: 0 },
    { question: "Simplify: 3(x + 4) - 2x", options: ["x + 12", "5x + 4", "x + 4", "5x + 12"], correctIndex: 0 },
    { question: "What is 15% of 200?", options: ["25", "30", "35", "20"], correctIndex: 1 },
    { question: "Solve: √144", options: ["14", "11", "12", "13"], correctIndex: 2 },
  ],
  Science: [
    { question: "What is the chemical symbol for water?", options: ["H2O", "CO2", "O2", "NaCl"], correctIndex: 0 },
    { question: "What planet is known as the Red Planet?", options: ["Jupiter", "Mars", "Venus", "Saturn"], correctIndex: 1 },
    { question: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi body"], correctIndex: 2 },
    { question: "What gas do plants absorb?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correctIndex: 2 },
    { question: "What is Newton's second law about?", options: ["Inertia", "F = ma", "Action-reaction", "Gravity"], correctIndex: 1 },
  ],
  English: [
    { question: "Which is a synonym for 'happy'?", options: ["Sad", "Elated", "Angry", "Tired"], correctIndex: 1 },
    { question: "What is a noun?", options: ["Action word", "Describing word", "Person/place/thing", "Connecting word"], correctIndex: 2 },
    { question: "Which sentence is correct?", options: ["Their going home", "They're going home", "There going home", "Theyre going home"], correctIndex: 1 },
    { question: "What is the past tense of 'run'?", options: ["Runned", "Running", "Ran", "Runs"], correctIndex: 2 },
    { question: "An antonym of 'brave' is:", options: ["Cowardly", "Bold", "Strong", "Fearless"], correctIndex: 0 },
  ],
  History: [
    { question: "Who was the first President of the USA?", options: ["Lincoln", "Jefferson", "Washington", "Adams"], correctIndex: 2 },
    { question: "In which year did World War II end?", options: ["1943", "1944", "1945", "1946"], correctIndex: 2 },
    { question: "The Renaissance began in which country?", options: ["France", "England", "Italy", "Spain"], correctIndex: 2 },
    { question: "Who discovered America in 1492?", options: ["Magellan", "Columbus", "Vespucci", "Drake"], correctIndex: 1 },
    { question: "The Great Wall is in which country?", options: ["Japan", "India", "China", "Korea"], correctIndex: 2 },
  ],
};

const defaultSubject = "General Knowledge";
const defaultQuestions: Question[] = [
  { question: "How many continents are there?", options: ["5", "6", "7", "8"], correctIndex: 2 },
  { question: "What is the largest ocean?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correctIndex: 3 },
  { question: "How many days in a leap year?", options: ["364", "365", "366", "367"], correctIndex: 2 },
  { question: "What is the boiling point of water (°C)?", options: ["90", "100", "110", "120"], correctIndex: 1 },
  { question: "Which is the smallest prime number?", options: ["0", "1", "2", "3"], correctIndex: 2 },
];

export function getQuestionsForSubject(subject: string): { quizSubject: string; questions: Question[] } {
  const key = Object.keys(questionBank).find(
    (k) => subject.toLowerCase().includes(k.toLowerCase())
  );
  if (key) return { quizSubject: key, questions: questionBank[key] };
  return { quizSubject: subject || defaultSubject, questions: defaultQuestions };
}

export type { Question };

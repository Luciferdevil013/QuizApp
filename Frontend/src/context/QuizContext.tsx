import React, { createContext, useContext, useState } from 'react';

interface Answer {
  questionId: string;
  selectedAnswer: string;
}

interface QuizContextType {
  currentQuestion: number;
  score: number;
  answers: Answer[];
  setCurrentQuestion: (question: number) => void;
  setScore: (score: number) => void;
  setAnswers: React.Dispatch<React.SetStateAction<Answer[]>>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  return (
    <QuizContext.Provider value={{
      currentQuestion,
      score,
      answers,
      setCurrentQuestion,
      setScore,
      setAnswers
    }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}; 
// src/pages/questions/QuestionPage.tsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  Clock,
  HelpCircle,
  X,
  CheckCircle,
  Info,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import QuestionDisplay from "../../components/question/QuestionDisplay";
import { useAITutor } from "../../context/AITutorContext";
import { sampleQuestions } from "../../data/mockData";

const QuestionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sendMessage, setScreenContext } = useAITutor();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);
  const [showAI, setShowAI] = useState(true);
  const currentQuestion = sampleQuestions[questionIndex];

  // Reset state & clear chat when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setTimeSpent(0);
    setShowExplanation(false);
    setScreenContext({
      text: currentQuestion.text,
      options: currentQuestion.options,
    });

    // map `id` param to sampleQuestions index
    const idx = id === "q1" ? 0 : 1;
    setQuestionIndex(idx);

    // start timer
    const timer = setInterval(() => setTimeSpent((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [id, currentQuestion, setScreenContext]);


  const handleSelectAnswer = (answerId: string) => {
    if (!isSubmitted) setSelectedAnswer(answerId);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    setIsSubmitted(true);

    // Always pass the question text as context
    const qText = currentQuestion;
    if (selectedAnswer === currentQuestion.correctAnswer) {
      sendMessage(
        "Great job! That's the correct answer. Would you like me to explain why?",
        qText
      );
    } else {
      sendMessage(
        `That's not quite right. The correct answer is ${currentQuestion.correctAnswer}. Would you like me to explain why?`,
        qText
      );
    }
  };

  const handleNextQuestion = () => {
    if (questionIndex < sampleQuestions.length - 1) {
      navigate(`/app/questions/q${questionIndex + 2}`);
    } else {
      navigate("/app/dashboard");
    }
  };

  const handlePrevQuestion = () => {
    if (questionIndex > 0) {
      navigate(`/app/questions/q${questionIndex}`);
    } else {
      navigate("/app/dashboard");
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Info Bar */}
      <div className="bg-white p-4 border-b flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-gray-700">
            <Clock size={16} className="mr-1" />
            <span>{formatTime(timeSpent)}</span>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                currentQuestion.difficulty === "Hard"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {currentQuestion.difficulty}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {currentQuestion.topic}
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <button
            className={`p-2 rounded-full ${
              isFlagged ? "text-red-500" : "text-gray-400 hover:text-gray-600"
            }`}
            onClick={() => setIsFlagged((f) => !f)}
          >
            <Flag size={18} />
          </button>
          <button
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 ml-2"
            onClick={() => setShowAI((a) => !a)}
          >
            {showAI ? <X size={18} /> : <HelpCircle size={18} />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">

          <QuestionDisplay
            id={currentQuestion.id}
            type={currentQuestion.type}
            text={currentQuestion.text}
            options={currentQuestion.options}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={handleSelectAnswer}
            isSubmitted={isSubmitted}
            correctAnswer={currentQuestion.correctAnswer}
          />

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              leftIcon={<ChevronLeft size={16} />}
              onClick={handlePrevQuestion}
            >
              Previous
            </Button>

            {isSubmitted ? (
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  leftIcon={<Info size={16} />}
                  onClick={() => setShowExplanation((e) => !e)}
                >
                  {showExplanation ? "Hide Explanation" : "Show Explanation"}
                </Button>
                <Button
                  rightIcon={<ChevronRight size={16} />}
                  onClick={handleNextQuestion}
                >
                  Next Question
                </Button>
              </div>
            ) : (
              <Button
                disabled={!selectedAnswer}
                onClick={handleSubmit}
                leftIcon={<CheckCircle size={16} />}
              >
                Submit Answer
              </Button>
            )}
          </div>

          {showExplanation && (
            <Card className="mt-6 border-green-200">
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Explanation
                </h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {currentQuestion.explanation}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
    </div>
  );
};

export default QuestionPage;

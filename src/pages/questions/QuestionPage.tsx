// src/pages/questions/QuestionPage.tsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  Clock,
  X,
  Info,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import QuestionDisplay from "../../components/question/QuestionDisplay";
import { useAITutor } from "../../context/AITutorContext";
import { fetchQuestionById, submitAnswer } from "../../lib/api";
import { useUser } from "../../context/UserContext";
import type { Question, NextQuestionResponse } from "../../lib/types";

const QuestionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sendMessage, setScreenContext } = useAITutor();
  const { user } = useUser();

  const [question, setQuestion] = useState<Question | null>(null);
  const [nextQuestion, setNextQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);
  const [showAI, setShowAI] = useState(true);

  // Load initial question
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchQuestionById(id)
      .then(q => setQuestion(q))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Reset state & push to AI whenever `question` changes
  useEffect(() => {
    if (!question) return;
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setShowExplanation(false);
    setTimeSpent(0);
    setNextQuestion(null);

    setScreenContext({
      blocks: question.content,
      options: question.options,
    });

    const timer = setInterval(() => setTimeSpent(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, [question, setScreenContext]);

  const handleSelectAnswer = (answerId: string) => {
    if (!isSubmitted) setSelectedAnswer(answerId);
  };

  const handleSubmit = async () => {
    if (!question || !selectedAnswer) return;
    setIsSubmitted(true);

    const isCorrect =
      Array.isArray(question.answers.correct_option_ids) &&
      question.answers.correct_option_ids[0] === selectedAnswer;

    // record & get next question
    try {
      const res: NextQuestionResponse = await submitAnswer({
        user_id: user!.id,
        question_id: question.id,
        selected_option: selectedAnswer,
        is_correct: isCorrect,
      });
      if (res.next_question) {
        setNextQuestion(res.next_question);
      }
    } catch (err) {
      console.error("Failed to submit answer:", err);
    }

    // prompt AI for explanation
    const reply = isCorrect
      ? "Nice! You've got it. Want me to explain why?"
      : `Not quite—the correct option is ${
          question.answers.correct_option_ids?.[0]
        }. Need an explanation?`;

    sendMessage(reply, {
      blocks: question.content,
      options: question.options,
    });
  };

  const handleNext = () => {
    if (nextQuestion) {
      // load the recommended next
      setQuestion(nextQuestion);
    } else {
      // no more questions
      navigate("/app/dashboard");
    }
  };

  const handlePrev = () => {
    navigate("/app/dashboard");
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <span>Loading user…</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span>Loading question…</span>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex items-center justify-center h-full">
        <span>Question not found.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <div className="bg-white p-4 border-b flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-gray-700">
            <Clock size={16} className="mr-1" />
            <span>{formatTime(timeSpent)}</span>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                question.difficulty > 4
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {question.difficulty}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {question.tags[0] ?? "General"}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className={`p-2 rounded-full ${
              isFlagged ? "text-red-500" : "text-gray-400 hover:text-gray-600"
            }`}
            onClick={() => setIsFlagged(f => !f)}
          >
            <Flag size={18} />
          </button>
          <button
            className="p-2 rounded-full text-gray-400 hover:text-gray-600"
            onClick={() => setShowAI(a => !a)}
          >
            {showAI ? <X size={18} /> : <Info size={18} />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <QuestionDisplay
          id={question.id}
          type={question.type}
          content={question.content}
          options={question.options}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={handleSelectAnswer}
          isSubmitted={isSubmitted}
          correctAnswer={
            Array.isArray(question.answers.correct_option_ids)
              ? question.answers.correct_option_ids[0]
              : null
          }
        />

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            leftIcon={<ChevronLeft size={16} />}
            onClick={handlePrev}
          >
            Previous
          </Button>

          {isSubmitted ? (
            <div className="flex space-x-3">
              <Button
                variant="outline"
                leftIcon={<Info size={16} />}
                onClick={() => setShowExplanation(e => !e)}
              >
                {showExplanation ? "Hide Explanation" : "Show Explanation"}
              </Button>
              <Button
                rightIcon={<ChevronRight size={16} />}
                onClick={handleNext}
              >
                Next
              </Button>
            </div>
          ) : (
            <Button
              disabled={!selectedAnswer}
              onClick={handleSubmit}
              leftIcon={<ChevronRight size={16} />}
            >
              Submit Answer
            </Button>
          )}
        </div>

        {showExplanation && question.explanation && (
          <Card className="mt-6 border-green-200">
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Explanation
              </h3>
              <p className="text-gray-700 whitespace-pre-line">
                {question.explanation}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuestionPage;

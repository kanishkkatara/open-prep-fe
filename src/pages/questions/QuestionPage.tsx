// src/pages/questions/QuestionPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Flag, Clock, X, Info } from "lucide-react";
import Button from "../../components/ui/Button";
import QuestionDisplay from "../../components/question/QuestionDisplay";
import PassageDisplay from "../../components/question/PassageDisplay";
import { useAITutor } from "../../context/AITutorContext";
import { useUser } from "../../context/UserContext";
import { fetchQuestionById, submitAnswer } from "../../lib/api";
import type {
  QuestionResponse,
  NextQuestionResponse,
  SingleQuestion,
} from "../../lib/types";

const QuestionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sendMessage, setScreenContext } = useAITutor();
  const { user } = useUser();

  // Use the unified QuestionResponse type
  const [question, setQuestion] = useState<QuestionResponse | null>(null);
  const [nextQuestion, setNextQuestion] = useState<QuestionResponse | null>(
    null
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);
  const [showAI, setShowAI] = useState(true);

  // Load initial question with subquestions
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchQuestionById(id, true)
      .then((q) => setQuestion(q))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Reset context on question change
  useEffect(() => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setShowExplanation(false);
    setTimeSpent(0);
    setNextQuestion(null);
    setCurrentIndex(0);

    if (question) {
      setScreenContext({
        blocks:
          question.kind === "composite" ? question.passage : question.content,
        options: question.kind === "composite" ? [] : question.options,
      });
    }

    const timer = setInterval(() => setTimeSpent((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [question, setScreenContext]);

  // Which SingleQuestion to display
  const displayed = useMemo<SingleQuestion | null>(() => {
    if (!question) return null;
    return question.kind === "composite"
      ? question.subquestions[currentIndex]
      : question;
  }, [question, currentIndex]);

  const handleSelectAnswer = (answerId: string) => {
    if (!isSubmitted) setSelectedAnswer(answerId);
  };

const handleSubmit = async () => {
  if (!displayed || !selectedAnswer || !user) return;
  setIsSubmitted(true);

  const correctId = displayed.answers.correct_option_id;
  const isCorrect = correctId === selectedAnswer;

  let apiResp: NextQuestionResponse | null = null;
  try {
    apiResp = await submitAnswer({
      user_id: user.id,
      question_id: displayed.id,
      selected_option: selectedAnswer,
      is_correct: isCorrect,
    });
  } catch (err) {
    console.error("Failed to submit answer:", err);
  }

  if (!question) return;
  if (question.kind === "composite") {
    const total = question.subquestions.length;
    // if this was the last sub-question, store the API's next
    if (currentIndex === total - 1) {
      setNextQuestion(apiResp?.next_question || null);
    }
  } else {
    // single-question case
    setNextQuestion(apiResp?.next_question || null);
  }
};

const handleNext = () => {
  if (!question) return;
  if (question.kind === "composite") {
    // composite: advance within subquestions first
    if (currentIndex + 1 < question.subquestions.length) {
      setCurrentIndex(i => i + 1);
      // reset UI state for the next sub-question
      setSelectedAnswer(null);
      setIsSubmitted(false);
      setShowExplanation(false);
      return;
    }
  }

  // either single-question, or out of sub-questions
  if (nextQuestion) {
    setQuestion(nextQuestion);
  } else {
    navigate("/app/dashboard");
  }
};

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  if (!question || !displayed) {
    return (
      <div className="flex items-center justify-center h-full">
        Question not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <div className="bg-white p-4 border-b flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Clock size={16} className="mr-1" />
          <span>{formatTime(timeSpent)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => setIsFlagged((f) => !f)}>
            <Flag
              size={18}
              className={isFlagged ? "text-red-500" : "text-gray-400"}
            />
          </button>
          <button onClick={() => setShowAI((a) => !a)}>
            {showAI ? <X size={18} /> : <Info size={18} />}
          </button>
        </div>
      </div>

      {/* Passage */}
      {question.kind === "composite" && (
        <div className="p-6 border-b">
          <PassageDisplay
            blocks={question.passage}
            questionType={question.type}
          />
        </div>
      )}

      {/* Question */}
      <div className="flex-1 overflow-y-auto p-6">
        <QuestionDisplay
          question={displayed}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={handleSelectAnswer}
          isSubmitted={isSubmitted}
        />

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => navigate("/app/dashboard")}
            leftIcon={<ChevronLeft size={16} />}
          >
            Previous
          </Button>
          {isSubmitted ? (
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowExplanation((e) => !e)}
                leftIcon={<Info size={16} />}
              >
                {showExplanation ? "Hide Explanation" : "Show Explanation"}
              </Button>
              <Button
                onClick={handleNext}
                rightIcon={<ChevronRight size={16} />}
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

        {/* {showExplanation && displayed.explanation && (
          <Card className="mt-6 border-green-200">
            <CardContent>
              <h3 className="font-semibold">Explanation</h3>
              <p className="whitespace-pre-line">{displayed.explanation}</p>
            </CardContent>
          </Card>
        )} */}
      </div>
    </div>
  );
};

export default QuestionPage;

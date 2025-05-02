import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Flag,
  Clock,
  X,
  Info,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import Button from "../../components/ui/Button";
import QuestionDisplay from "../../components/question/QuestionDisplay";
import PassageDisplay from "../../components/question/PassageDisplay";
import { useAITutor } from "../../context/AITutorContext";
import { useUser } from "../../context/UserContext";
import {
  fetchQuestionById,
  submitAnswer,
  updateQuestionIsDeleted,
} from "../../lib/api";
import type {
  QuestionResponse,
  SingleQuestion,
  CellCoordinate,
} from "../../lib/types";

const QuestionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setScreenContext, sendMessage } = useAITutor();
  const { user } = useUser();

  const [question, setQuestion] = useState<QuestionResponse | null>(null);
  const [nextQid, setNextQid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selAns, setSelAns] = useState<string | null>(null);
  const [selGrid, setSelGrid] = useState<CellCoordinate[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [explanationRequested, setExplanationRequested] = useState(false);
  const [nextClicked, setNextClicked] = useState(false);

  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  const [flagged, setFlagged] = useState(false);

  // ─── Load question ─────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchQuestionById(id)
      .then((q) => {
        if (q.kind === "composite" && q.subquestions.length > 0) {
          q.subquestions.sort((a, b) => (a.order || 0) - (b.order || 0));
        }
        setQuestion(q);
        setFlagged(q.is_deleted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // ─── Reset state when question changes ──────────────────────────
  useEffect(() => {
    setSelAns(null);
    setSelGrid([]);
    setSubmitted(false);
    setNextQid(null);
    setNextClicked(false);
    setPaused(false);
    setTime(0);
    setExplanationRequested(false);

    if (question) {
      setScreenContext({ id: question.id, parent_id: question.parent?.id });
    }
  }, [question, setScreenContext]);

  // ─── Timer ─────────────────────────────────────────────────────
  useEffect(() => {
    if (paused) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      return;
    }
    timerRef.current = window.setInterval(() => setTime((t) => t + 1), 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [paused]);

  // ─── Displayed question ────────────────────────────────────────
  const displayed: SingleQuestion | null = useMemo(() => {
    if (!question) return null;
    return question.kind === "composite" ? question.subquestions[0] : question;
  }, [question]);

  // ─── Handlers ─────────────────────────────────────────────────
  const onSelectAns = (id: string) => {
    if (!submitted) setSelAns(id);
  };

  const onSelectGrid = (r: number, c: number) => {
    if (submitted || !displayed) return;
    setSelGrid((prev) => {
      const filtered = prev.filter((p) => p.column_index !== c);
      return [...filtered, { row_index: r, column_index: c }];
    });
  };

  const onSubmit = async () => {
    if (!displayed || !user) return;
    setSubmitted(true);

    const payload: any = {
      user_id: user.id,
      question_id: displayed.id,
      is_correct: false,
      time_taken: time,
    };

    if (displayed.type === "two-part-analysis") {
      if (selGrid.length !== 2) return;
      payload.selected_pairs = selGrid;
    } else {
      if (!selAns) return;
      payload.selected_option = selAns;
    }

    try {
      const resp = await submitAnswer(payload);
      setNextQid(resp.next_question_id || null);
    } catch (e) {
      console.error(e);
    }
  };

  const onNext = () => {
    if (nextQid) {
      navigate(`/app/questions/${nextQid}`);
    } else {
      setNextClicked(true);
    }
  };

  useEffect(() => {
    if (nextClicked && nextQid) {
      navigate(`/app/questions/${nextQid}`);
    }
  }, [nextClicked, nextQid, navigate]);

  const handleTogglePause = () => setPaused((p) => !p);
  const handleReset = () => setTime(0);

  // ─── Soft-delete (flag) handler ────────────────────────────────
  const handleToggleFlag = async () => {
    if (!question) return;
    try {
      await updateQuestionIsDeleted(question.id, !flagged);
      setFlagged(!flagged);
      // if (!flagged) navigate("/app/questions");
    } catch (e) {
      console.error("Could not update delete flag:", e);
    }
  };

  const handleShowExplanation = async () => {
    if (explanationRequested) return;
    setExplanationRequested(true);
    await sendMessage("Please explain this question.");
  };

  // ─── Loading state ────────────────────────────────────────────
  if (loading || !displayed) {
    return (
      <div className="flex items-center justify-center h-full">Loading…</div>
    );
  }

  // ─── Timer formatting ─────────────────────────────────────────
  const mm = Math.floor(time / 60);
  const ss = (time % 60).toString().padStart(2, "0");

  const isComposite = question?.parent !== null;
  const metaType = isComposite ? question?.parent?.type : question.type;
  const metaDifficulty = isComposite ? question?.parent?.difficulty : question.difficulty;
  const metaTags = isComposite ? question?.parent?.tags : question.tags;

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white p-4 border-b flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Clock size={16} />
          <Button variant="outline" size="sm" onClick={handleTogglePause}>
            {paused ? <Pause size={16} /> : <Play size={16} />}
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw size={16} />
          </Button>
          <span className="text-lg">{`${mm}:${ss}`}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={handleToggleFlag}>
            <Flag size={18} className={flagged ? "text-red-500" : "text-gray-400"} />
          </button>
          <X size={18} onClick={() => navigate("/app/questions")} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center space-x-4 px-6 py-3">
          <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full capitalize">
            {metaType?.replace("-", " ")}
          </span>
          <span className="text-sm text-gray-600">Difficulty: {metaDifficulty}</span>
          <span className="text-sm text-gray-600">Tags: {metaTags?.join(", ")}</span>
        </div>

        {question &&
          "parent" in question &&
          question?.parent?.content &&
          question.parent.content.length > 0 && (
          <div className="px-6">
            <PassageDisplay
              blocks={question.parent.content}
              questionType={question.parent.type}
            />
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <QuestionDisplay
            question={displayed}
            selectedAnswer={selAns}
            selectedGrid={selGrid}
            onSelectAnswer={onSelectAns}
            onSelectGrid={onSelectGrid}
            isSubmitted={submitted}
          />

          <div className="flex justify-between">
            {!submitted ? (
              <Button
                onClick={onSubmit}
                disabled={
                  displayed.type === "two-part-analysis"
                    ? selGrid.length !== 2
                    : !selAns
                }
                leftIcon={<ChevronRight size={16} />}
              >
                Submit Answer
              </Button>
            ) : (
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleShowExplanation}
                  leftIcon={<Info size={16} />}
                  disabled={explanationRequested}
                >
                  Show Explanation
                </Button>
                <Button onClick={onNext} rightIcon={<ChevronRight size={16} />}>
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
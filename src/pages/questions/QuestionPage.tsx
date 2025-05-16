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
  Loader,
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
  Annotation,
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
  const [dropdownValues, setDropdownValues] = useState<(number | null)[]>([]);
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
        if (q.kind === "composite" && q.subquestions.length) {
          q.subquestions.sort((a, b) => (a.order || 0) - (b.order || 0));
        }
        setQuestion(q);
        setFlagged(q.is_deleted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // ─── Select the current sub-question (or single) ───────────────
  const displayed: SingleQuestion | null = useMemo(() => {
    if (!question) return null;
    return question.kind === "composite"
      ? question.subquestions[0]
      : question;
  }, [question]);

  // ─── Shared states for content types ───────────────────────────
  const hasDropdowns = useMemo(
    () => displayed?.content.some((b) => b.type === "dropdown") ?? false,
    [displayed]
  );
  const hasGrid = useMemo(
    () => displayed?.content.some((b) => b.type === "ds_grid") ?? false,
    [displayed]
  );
  const gridColCount = useMemo(
    () =>
      displayed?.content.find((b) => b.type === "ds_grid")?.col_headers
        ?.length ?? 0,
    [displayed]
  );
  const isMCQ = useMemo(
    () => displayed && !hasDropdowns && !hasGrid,
    [displayed, hasDropdowns, hasGrid]
  );

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

    if (displayed) {
      setDropdownValues(Array(displayed.content.length).fill(null));
      setScreenContext({ id: question!.id, parent_id: question!.parent?.id, type: question!.parent?.type || question!.type, tags: question?.tags });
    }
  }, [displayed, question, setScreenContext]);

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
  const onDropdownChange = (blockIdx: number, optIdx: number) => {
    setDropdownValues((dv) => {
      const copy = [...dv];
      copy[blockIdx] = optIdx;
      return copy;
    });
  };

  const onSubmit = async () => {
    if (!displayed || !user) return;
    setSubmitted(true);
    setPaused(true);

    const payload: any = {
      user_id: user.id,
      time_taken: time,
    };

    let is_correct = false;

    if (hasDropdowns) {
      const missing = displayed.content.some(
        (b, i) => b.type === "dropdown" && dropdownValues[i] == null
      );
      if (missing) return;

      payload.selected_options = displayed.content.reduce<number[]>(
        (acc, b, i) => {
          if (b.type === "dropdown") acc.push(dropdownValues[i]!);
          return acc;
        },
        []
      );

      is_correct =
        JSON.stringify(payload.selected_options) ===
        JSON.stringify(displayed.answers.selected_pairs);
    } else if (hasGrid) {
      if (selGrid.length !== gridColCount) return;

      payload.selected_options = selGrid;

      is_correct =
        JSON.stringify(payload.selected_options) ===
        JSON.stringify(displayed.answers.selected_pairs);
    } else if (isMCQ) {
      if (!selAns) return;

      payload.selected_options = selAns;

      is_correct =
        payload.selected_options === displayed.answers.correct_option_id;
    }

    payload.is_correct = is_correct;

    try {
      const resp = await submitAnswer(displayed.id, payload);
      setNextQid(resp.next_question_id || null);
    } catch (e) {
      console.error(e);
    }
  };

  const onNext = () => {
    if (nextQid) navigate(`/app/questions/${nextQid}`);
    else setNextClicked(true);
  };
  useEffect(() => {
    if (nextClicked && nextQid) {
      navigate(`/app/questions/${nextQid}`);
    }
  }, [nextClicked, nextQid, navigate]);

  const handleTogglePause = () => setPaused((p) => !p);
  const handleReset = () => setTime(0);
  const handleToggleFlag = async () => {
    if (!question) return;
    try {
      await updateQuestionIsDeleted(question.id, !flagged);
      setFlagged(!flagged);
    } catch (e) {
      console.error("Flag toggle failed:", e);
    }
  };
  const handleShowExplanation = async () => {
    if (explanationRequested) return;
    setExplanationRequested(true);
    await sendMessage("Please explain this question.");
  };

  if (loading || !displayed) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader size={48} className="animate-spin text-gray-500" />
      </div>
    );
  }

  const annotations = (displayed.extras?.annotations as Annotation[]) || [];

  const mm = Math.floor(time / 60);
  const ss = (time % 60).toString().padStart(2, "0");
  const isComposite = question?.parent !== null;
  const meta = isComposite ? question!.parent! : question!;
  const metaType = meta.type.replace("-", " ");
  const metaDifficulty = meta.difficulty;
  const metaTags = meta.tags.join(", ");

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
          <div className="relative group inline-block">
            <button onClick={handleToggleFlag}>
              <Flag
                size={18}
                className={`transition-colors ${
                  flagged
                    ? "text-red-500 group-hover:text-red-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
            </button>
            <span
              className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              {flagged ? "Unflag this question" : "Flag this question"}
            </span>
          </div>
          <X size={18} onClick={() => navigate("/app/questions")} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center space-x-4 px-6 py-3">
          <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full capitalize">
            {metaType}
          </span>
          <span className="text-sm text-gray-600">
            Difficulty: {metaDifficulty}
          </span>
          <span className="text-sm text-gray-600">Tags: {metaTags}</span>
        </div>

        {question &&
          "parent" in question &&
          question?.parent?.content &&
          question.parent.content.length > 0 && (
            <div className="px-6">
              <PassageDisplay
                blocks={question.parent.content}
                questionType={question.parent.type}
                annotations={annotations}
              />
            </div>
          )}

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <QuestionDisplay
            question={displayed}
            selectedAnswer={selAns}
            selectedGrid={selGrid}
            dropdownValues={dropdownValues}
            onSelectAnswer={onSelectAns}
            onSelectGrid={onSelectGrid}
            onDropdownChange={onDropdownChange}
            isSubmitted={submitted}
          />

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Previous
            </Button>
            {!submitted ? (
              <Button
                onClick={onSubmit}
                disabled={(() => {
                  if (hasDropdowns) {
                    return displayed.content.some(
                      (b, i) =>
                        b.type === "dropdown" && dropdownValues[i] == null
                    );
                  }
                  if (hasGrid) {
                    return selGrid.length !== gridColCount;
                  }
                  return !selAns;
                })()}
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

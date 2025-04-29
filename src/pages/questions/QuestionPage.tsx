// src/pages/questions/QuestionPage.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Flag,
  Clock,
  X,
  Info,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import QuestionDisplay from '../../components/question/QuestionDisplay';
import PassageDisplay from '../../components/question/PassageDisplay';
import { useAITutor } from '../../context/AITutorContext';
import { useUser } from '../../context/UserContext';
import { fetchQuestionById, submitAnswer } from '../../lib/api';
import type {
  QuestionResponse,
  SingleQuestion,
  CellCoordinate,
} from '../../lib/types';

const QuestionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setScreenContext } = useAITutor();
  const { user } = useUser();

  const [question, setQuestion] = useState<QuestionResponse | null>(null);
  const [nextQ, setNextQ] = useState<QuestionResponse | null>(null);
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selAns, setSelAns] = useState<string | null>(null);
  const [selGrid, setSelGrid] = useState<CellCoordinate[]>([]);
  const [submitted, setSubmitted] = useState(false);

  // Timer state
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  // UI toggles
  const [flagged, setFlagged] = useState(false);
  const [explain, setExplain] = useState(false);

  // Load question
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchQuestionById(id, true)
      .then(q => setQuestion(q))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Setup/reset on question change
  useEffect(() => {
    setSelAns(null);
    setSelGrid([]);
    setSubmitted(false);
    setNextQ(null);
    setIdx(0);
    setExplain(false);
    setPaused(false);
    setTime(0);

    if (question) {
      setScreenContext({
        blocks: question.kind === 'composite' ? question.passage : question.content,
        options: question.kind === 'composite' ? [] : question.options,
      });
    }
  }, [question, setScreenContext]);

  // Timer effect
  useEffect(() => {
    if (paused) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      return;
    }
    timerRef.current = window.setInterval(() => setTime(t => t + 1), 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [paused]);

  // Determine displayed question (composite vs single)
  const displayed: SingleQuestion | null = useMemo(() => {
    if (!question) return null;
    return question.kind === 'composite'
      ? question.subquestions[idx]
      : question;
  }, [question, idx]);

  // Handlers
  const onSelectAns = (id: string) => {
    if (!submitted) setSelAns(id);
  };
  const onSelectGrid = (r: number, c: number) => {
    if (submitted || !displayed) return;
    setSelGrid(prev => {
      const filtered = prev.filter(p => p.column_index !== c);
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
    };
    if (displayed.type === 'two-part-analysis') {
      if (selGrid.length !== 2) return;
      payload.selected_pairs = selGrid;
    } else {
      if (!selAns) return;
      payload.selected_option = selAns;
    }
    try {
      const resp = await submitAnswer(payload);
      if (question?.kind === 'composite' && idx + 1 < question.subquestions.length) {
        setIdx(i => i + 1);
      } else {
        setNextQ(resp.next_question || null);
      }
    } catch (e) {
      console.error(e);
    }
  };
  const onNext = () => {
    if (nextQ) setQuestion(nextQ);
    else navigate('/app/dashboard');
  };
  const onTogglePause = () => setPaused(p => !p);
  const onReset = () => setTime(0);

  if (loading || !displayed) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  // Format mm:ss
  const mm = Math.floor(time / 60);
  const ss = (time % 60).toString().padStart(2, '0');

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar with Timer Controls */}
      <div className="bg-white p-4 border-b flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Clock size={16} />
          <Button variant="outline" size="sm" onClick={onTogglePause}>
            {paused ? <Pause size={16} /> : <Play size={16} />}
          </Button>

          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw size={16} />
          </Button>
          <span className="text-lg">{`${mm}:${ss}`}</span>
          
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => setFlagged(f => !f)}><Flag size={18} className={flagged ? 'text-red-500' : 'text-gray-400'} /></button>
          <X size={18} onClick={() => navigate('/app/questions')}/>
        </div>
      </div>

      {/* Composite passage */}
      {question && question.kind === 'composite' && (
        <div className="p-6 border-b">
          <PassageDisplay blocks={question.passage} questionType={question.type} />
        </div>
      )}

      {/* Main question content */}
      <div className="flex-1 overflow-y-auto p-6">
        <QuestionDisplay
          question={displayed}
          selectedAnswer={selAns}
          selectedGrid={selGrid}
          onSelectAnswer={onSelectAns}
          onSelectGrid={onSelectGrid}
          isSubmitted={submitted}
        />

        <div className="flex justify-between mt-6">
          {!submitted ? (
            <Button
              onClick={onSubmit}
              disabled={displayed.type === 'two-part-analysis' ? selGrid.length !== 2 : !selAns}
              leftIcon={<ChevronRight size={16} />}
            >Submit Answer</Button>
          ) : (
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setExplain(e => !e)} leftIcon={<Info size={16} />}>{explain ? 'Hide Explanation' : 'Show Explanation'}</Button>
              <Button onClick={onNext} rightIcon={<ChevronRight size={16} />}>Next</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;

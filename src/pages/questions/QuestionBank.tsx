import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import * as Slider from "@radix-ui/react-slider";
import * as Switch from "@radix-ui/react-switch";
import katex from "katex";
import "katex/dist/katex.min.css";
import { fetchQuestionSummaries } from "../../lib/api";
import type { QuestionSummary } from "../../lib/types";
import Button from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { questionCategories } from "../../lib/questionCategories";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

interface Option {
  value: string;
  label: string;
}

// ─── Debounce hook ─────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

// ─── LaTeX renderer ────────────────────────────────────────────────────────────

const renderContent = (text: string = ""): string =>
  text.replace(/\\\((.+?)\\\)/g, (_, expr) =>
    katex.renderToString(expr, { throwOnError: false })
  );

// ─── Component ─────────────────────────────────────────────────────────────────

const QuestionBank: React.FC = () => {
  const navigate = useNavigate();

  // ─── State ───────────────────────────────────────────────────────────────────

  const [questions, setQuestions] = useState<QuestionSummary[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [selectedTypes, setSelectedTypes] = useState<Option[]>([]);
  const [selectedTags, setSelectedTags] = useState<Option[]>([]);
  const [difficultyRange, setDifficultyRange] = useState<number[]>([1, 7]);
  const [onlyNew, setOnlyNew] = useState<boolean>(false);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // ─── Debounced values ────────────────────────────────────────────────────────

  const debouncedTypes = useDebounce(selectedTypes, 500);
  const debouncedTags = useDebounce(selectedTags, 500);
  const debouncedDifficulty = useDebounce(difficultyRange, 500);

  // ─── Options ─────────────────────────────────────────────────────────────────

  const typeOptions: Option[] = questionCategories.map(({ type, label }) => ({
    value: type,
    label,
  }));

  const tagOptions: Option[] = useMemo(() => {
    const types = debouncedTypes.map((t) => t.value);
    const acc: Record<string, Option> = {};
    questionCategories
      .filter((cat) => types.includes(cat.type))
      .forEach((cat) => {
        cat.tags.forEach((tag) => {
          acc[tag.value] = { value: tag.value, label: tag.label };
        });
      });
    return Object.values(acc);
  }, [debouncedTypes]);

  // ─── Fetch summaries ─────────────────────────────────────────────────────────

  useEffect(() => {
    let isCurrent = true; // ← guard for stale requests
    setLoading(true);

    (async () => {
      try {
        const data = await fetchQuestionSummaries({
          type: debouncedTypes.map((t) => t.value),
          tags: debouncedTags.map((t) => t.value),
          minDifficulty: debouncedDifficulty[0],
          maxDifficulty: debouncedDifficulty[1],
          progress_filter: onlyNew ? "non-attempted" : "all",
          page,
          pageSize,
        });
        if (!isCurrent) return; // ← ignore if a newer fetch was started
        setQuestions(data.filter((q) => !q.parentId));
      } catch (e) {
        if (isCurrent) {
          console.error("Error fetching questions:", e);
          toast.error("Failed to fetch questions.");
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    })();

    return () => {
      isCurrent = false; // ← mark this effect as “stale” on cleanup
    };
  }, [debouncedTypes, debouncedTags, debouncedDifficulty, onlyNew, page]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [debouncedTypes, debouncedTags, debouncedDifficulty, onlyNew]);

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="p-6">
      {/* Filters */}
      <Card className="mb-6 bg-white shadow rounded-lg">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 items-center">
            {/* Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <Select
                options={typeOptions}
                isMulti
                value={selectedTypes}
                onChange={(v) => setSelectedTypes(v as Option[])}
                placeholder="Select types..."
                classNamePrefix="react-select"
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 1000 }) }}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <Select
                options={tagOptions}
                isMulti
                value={selectedTags}
                onChange={(v) => setSelectedTags(v as Option[])}
                placeholder="Select tags..."
                classNamePrefix="react-select"
                isDisabled={!debouncedTypes.length}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 1000 }) }}
              />
            </div>

            {/* Show only new questions toggle */}
            <div className="flex items-center space-x-3">
              <label
                htmlFor="onlyNew"
                className="text-sm font-medium whitespace-nowrap"
              >
                Show only unattempted questions
              </label>
              <Switch.Root
                id="onlyNew"
                checked={onlyNew}
                onCheckedChange={setOnlyNew}
                className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow transition-transform translate-x-1 data-[state=checked]:translate-x-6" />
              </Switch.Root>
            </div>

            {/* Difficulty slider */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Difficulty
              </label>
              <Slider.Root
                className="relative flex items-center h-6 select-none w-full"
                value={difficultyRange}
                onValueChange={setDifficultyRange}
                min={1}
                max={7}
                step={1}
                aria-label="Difficulty range"
              >
                <Slider.Track className="bg-gray-200 relative flex-1 h-1 rounded-full">
                  <Slider.Range className="absolute bg-blue-500 h-full rounded-full" />
                </Slider.Track>
                {[0, 1].map((i) => (
                  <Slider.Thumb
                    key={i}
                    className="block w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow focus:outline-none"
                  />
                ))}
              </Slider.Root>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Sub 505 Level</span>
                <span>805+ Level</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question List */}
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Loader size={48} className="animate-spin text-gray-500" />
        </div>
      ) : (
        <ul className="divide-y">
          {questions.map((q) => (
            <li
              key={q.id}
              className={`py-4 pl-3 pr-2 hover:bg-gray-50 cursor-pointer border-l-4 border-t-0 border-r-0 border-b-0
                ${
                  q.attempted
                    ? q.correct
                      ? "border-l-green-500"
                      : "border-l-red-500"
                    : "border-l-transparent"
                }
              `}
              onClick={() => {
                const targetId = q.first_subquestion_id || q.id; // ✅ NEW LOGIC
                navigate(`/app/questions/${targetId}`);
              }}
            >
              <div className="flex items-baseline space-x-3">
                <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full capitalize whitespace-nowrap">
                  {q.type.replace("-", " ")}
                </span>
                <span
                  className="text-lg font-medium truncate"
                  dangerouslySetInnerHTML={{
                    __html: renderContent(q.preview_text || ""),
                  }}
                />
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Difficulty: {q.difficulty} | Tags: {q.tags.join(", ")}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-6">
        <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </Button>
        <span className="self-center">Page {page}</span>
        <Button
          disabled={questions.length < pageSize}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default QuestionBank;

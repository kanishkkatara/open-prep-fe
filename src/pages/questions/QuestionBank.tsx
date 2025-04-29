// src/pages/questions/QuestionBank.tsx

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import * as Slider from "@radix-ui/react-slider";
import { fetchQuestionSummaries } from "../../lib/api";
import type { QuestionSummary } from "../../lib/types";
import Button from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { questionCategories } from "../../lib/questionCategories";

interface Option {
  value: string;
  label: string;
}

// debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const QuestionBank: React.FC = () => {
  const navigate = useNavigate();

  // state
  const [questions, setQuestions] = useState<QuestionSummary[]>([]);
  const [loading, setLoading] = useState(false);

  // filters
  const [selectedTypes, setSelectedTypes] = useState<Option[]>([]);
  const [selectedTags, setSelectedTags] = useState<Option[]>([]);
  const [difficultyRange, setDifficultyRange] = useState<number[]>([1, 7]);

  // debounced filters
  const debouncedTypes = useDebounce(selectedTypes, 500);
  const debouncedTags = useDebounce(selectedTags, 500);
  const debouncedDifficulty = useDebounce(difficultyRange, 500);

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // type & tag options
  const typeOptions: Option[] = questionCategories.map(({ type, label }) => ({
    value: type,
    label,
  }));
  const tagOptions: Option[] = useMemo(() => {
    const types = debouncedTypes.map(t => t.value);
    const acc: Record<string, Option> = {};
    questionCategories
      .filter(cat => types.includes(cat.type))
      .forEach(cat => {
        cat.tags.forEach(tag => {
          acc[tag.value] = { value: tag.value, label: tag.label };
        });
      });
    return Object.values(acc);
  }, [debouncedTypes]);

  // fetch summaries
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchQuestionSummaries({
          type: debouncedTypes.map(t => t.value),
          tags: debouncedTags.map(t => t.value),
          minDifficulty: debouncedDifficulty[0],
          maxDifficulty: debouncedDifficulty[1],
          page,
          pageSize,
        });
        setQuestions(data.filter(q => !q.parentId));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [debouncedTypes, debouncedTags, debouncedDifficulty, page]);

  // reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [debouncedTypes, debouncedTags, debouncedDifficulty]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Question Bank</h1>

      {/* Filters */}
      <Card className="mb-6 bg-white shadow rounded-lg">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <Select
                options={typeOptions}
                isMulti
                value={selectedTypes}
                onChange={v => setSelectedTypes(v as Option[])}
                placeholder="Select types..."
                classNamePrefix="react-select"
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={{ menuPortal: base => ({ ...base, zIndex: 1000 }) }}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <Select
                options={tagOptions}
                isMulti
                value={selectedTags}
                onChange={v => setSelectedTags(v as Option[])}
                placeholder="Select tags..."
                classNamePrefix="react-select"
                isDisabled={!debouncedTypes.length}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={{ menuPortal: base => ({ ...base, zIndex: 1000 }) }}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium mb-1">
              Difficulty: {difficultyRange[0]} – {difficultyRange[1]}
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
              {[0, 1].map(i => (
                <Slider.Thumb
                  key={i}
                  className="block w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow focus:outline-none"
                />
              ))}
            </Slider.Root>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              {[1,2,3,4,5,6,7].map(n => <span key={n}>{n}</span>)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question List */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="divide-y">
          {questions.map(q => (
            <li
              key={q.id}
              className="py-4 px-2 hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/app/questions/${q.id}`)}
            >
              <div className="flex items-baseline space-x-3">
                {/* 1-line badge */}
                <span className="
                  inline-flex
                  items-center
                  bg-blue-100
                  text-blue-800
                  text-xs
                  font-medium
                  px-2
                  py-0.5
                  rounded-full
                  capitalize
                  whitespace-nowrap
                ">
                  {q.type.replace("-", " ")}
                </span>
                {/* Preview text */}
                <span className="text-lg font-medium truncate">
                  {q.preview_text?.trim()}
                </span>
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
        <Button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          Previous
        </Button>
        <span className="self-center">Page {page}</span>
        <Button
          disabled={questions.length < pageSize}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default QuestionBank;

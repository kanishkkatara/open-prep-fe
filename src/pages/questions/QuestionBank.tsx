// src/pages/questions/QuestionBank.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchQuestionSummaries } from "../../lib/api";
import { Question } from "../../lib/types";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const QuestionBank: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  // filter & pagination state
  const [typeFilter, setTypeFilter] = useState("");
  const [tagsFilter, setTagsFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchQuestionSummaries({
          type: typeFilter || undefined,
          tags: tagsFilter
            ? tagsFilter.split(",").map((t) => t.trim())
            : undefined,
          difficulty: difficultyFilter
            ? parseInt(difficultyFilter, 10)
            : undefined,
          page,
          pageSize,
        });
        setQuestions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [typeFilter, tagsFilter, difficultyFilter, page]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Question Bank</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Input
          placeholder="Type"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        />
        <Input
          placeholder="Tags (comma-separated)"
          value={tagsFilter}
          onChange={(e) => setTagsFilter(e.target.value)}
        />
        <Input
          placeholder="Difficulty"
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
        />
        <Button onClick={() => setPage(1)}>Apply Filters</Button>
      </div>

      {/* List */}
      {loading ? (
        <div>Loading…</div>
      ) : (
        <ul className="divide-y">
          {questions.map((q) => (
            <li
              key={q.id}
              className="py-4 px-2 hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/app/questions/${q.id}`)}
            >
              <div className="font-medium">{q.type}</div>
              <div className="text-sm text-gray-600">
                Difficulty: {q.difficulty} | Tags: {q.tags?.join(", ")}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-6">
        <Button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
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

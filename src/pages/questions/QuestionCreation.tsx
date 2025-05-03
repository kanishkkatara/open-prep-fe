import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";

import type {
  ContentBlock,
  Option as OptionType,
  AnswerSchema,
} from "../../lib/types";

import { useUser } from "../../context/UserContext";

const QUESTION_TYPES = [
  "problem-solving",
  "data-sufficiency",
  "critical-reasoning",
  "reading-comprehension",
  "table-analysis",
  "graphics-interpretation",
  "two-part-analysis",
  "multi-source-reasoning",
];

const BLOCK_TYPES = [
  "paragraph",
  "image",
  "table",
  "list",
  "dropdown",
  "numeric",
  "matrix",
  "ds_grid",
];

export default function QuestionCreator() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [type, setType] = useState<string>(QUESTION_TYPES[0]);
  const [difficulty, setDifficulty] = useState<number>(1);
  const [tags, setTags] = useState<string[]>([]);

  const [content, setContent] = useState<ContentBlock[]>([]);
  const [options, setOptions] = useState<OptionType[]>([]);
  const [answers, setAnswers] = useState<AnswerSchema>({});

  const [twoPartSelections, setTwoPartSelections] = useState<
    { row_index: number; column_index: number }[]
  >([]);

  const [subQuestions, setSubQuestions] = useState<
    {
      type: string;
      content: ContentBlock[];
      options: OptionType[];
      answers: AnswerSchema;
      difficulty: number;
      tags: string[];
    }[]
  >([]);

  // -------------------- Helpers --------------------

  const addContentBlock = () => {
    setContent([...content, { type: "paragraph" }]);
  };

  const removeContentBlock = (idx: number) => {
    setContent(content.filter((_, i) => i !== idx));
  };

  const addOptionBlock = () => {
    const nextId = String.fromCharCode(65 + options.length); // A, B, C...
    setOptions([...options, { id: nextId, blocks: [{ type: "paragraph", text: "" }] }]);
  };

  const removeOptionBlock = (idx: number) => {
    setOptions(options.filter((_, i) => i !== idx));
  };

  const addSubQuestion = () => {
    setSubQuestions([
      ...subQuestions,
      {
        type: "single-choice",
        content: [],
        options: [],
        answers: {},
        difficulty,
        tags,
      },
    ]);
  };

  const removeSubQuestion = (idx: number) => {
    setSubQuestions(subQuestions.filter((_, i) => i !== idx));
  };

  const updateAnswerForTwoPart = (index: number, value: number) => {
    const updated = [...twoPartSelections];
    updated[index] = { row_index: value, column_index: 0 };
    setTwoPartSelections(updated);
  };

  const handleSubmit = async () => {
    try {
      const BASE_URL = import.meta.env.VITE_API_URL;
      let finalAnswers = { ...answers };

      // Two-Part Analysis selections
      if (type === "two-part-analysis") {
        finalAnswers.selected_pairs = twoPartSelections;
      }

      // Validate Grid answers
      const gridBlock = content.find(
        (b) => b.type === "matrix" || b.type === "ds_grid"
      );
      if (gridBlock && answers.selected_pairs?.length) {
        finalAnswers.selected_pairs = answers.selected_pairs;
      }

      let payload;

      if (["multi-source-reasoning", "reading-comprehension"].includes(type)) {
        payload = [
          {
            type,
            content,
            options: [],
            answers: { correct_option_id: null },
            tags,
            difficulty,
          },
          ...subQuestions.map((sq, idx) => ({
            type: sq.type,
            order: idx + 1,
            content: sq.content,
            options: sq.options,
            answers: sq.answers,
            tags: sq.tags,
            difficulty: sq.difficulty,
          })),
        ];

        const res = await fetch(`${BASE_URL}/api/questions/bulk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(await res.text());
      } else {
        payload = {
          type,
          content,
          options,
          answers: finalAnswers,
          tags,
          difficulty,
        };

        const res = await fetch(`${BASE_URL}/api/questions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(await res.text());
      }

      navigate("/app/questions");
    } catch (err: any) {
      alert("Failed: " + err.message);
    }
  };

  // -------------------- Render Block --------------------

  const renderBlock = (
    blk: ContentBlock,
    idx: number,
    update: (key: keyof ContentBlock, value: any) => void,
    updateData: (key: string, value: any) => void,
    remove?: () => void
  ) => {
    return (
      <div key={idx} className="border rounded p-3 my-2 space-y-2">
        <div className="flex justify-between">
          <select
            value={blk.type}
            onChange={(e) => update("type", e.target.value)}
          >
            {BLOCK_TYPES.map((bt) => (
              <option key={bt} value={bt}>
                {bt}
              </option>
            ))}
          </select>
          {remove && (
            <button onClick={remove} className="text-red-500">Remove</button>
          )}
        </div>

        {blk.type === "paragraph" && (
          <Textarea
            value={blk.text || ""}
            onChange={(e) => update("text", e.target.value)}
            placeholder="Paragraph text"
          />
        )}

        {blk.type === "image" && (
          <>
            <Input
              placeholder="Image URL"
              value={blk.url || ""}
              onChange={(e) => update("url", e.target.value)}
            />
            <Input
              placeholder="Alt text"
              value={blk.alt || ""}
              onChange={(e) => update("alt", e.target.value)}
            />
          </>
        )}

        {blk.type === "dropdown" && (
          <>
            <Input
              placeholder="Placeholder"
              value={blk.data?.placeholder || ""}
              onChange={(e) => updateData("placeholder", e.target.value)}
            />
            <Textarea
              placeholder="Options, comma separated"
              value={blk.data?.options?.join(",") || ""}
              onChange={(e) =>
                updateData(
                  "options",
                  e.target.value.split(",").map((s) => s.trim())
                )
              }
            />
          </>
        )}

        {blk.type === "numeric" && (
          <Input
            placeholder="Numeric placeholder"
            value={blk.data?.placeholder || ""}
            onChange={(e) => updateData("placeholder", e.target.value)}
          />
        )}

        {(blk.type === "matrix" || blk.type === "ds_grid") && (
          <>
            <Input
              placeholder="Row headers, comma-separated"
              value={blk.row_headers?.join(",") || ""}
              onChange={(e) =>
                update(
                  "row_headers",
                  e.target.value.split(",").map((s) => s.trim())
                )
              }
            />
            <Input
              placeholder="Column headers, comma-separated"
              value={blk.col_headers?.join(",") || ""}
              onChange={(e) =>
                update(
                  "col_headers",
                  e.target.value.split(",").map((s) => s.trim())
                )
              }
            />
          </>
        )}
      </div>
    );
  };

    // -------------------- Render --------------------

    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Create New GMAT Question</h1>
  
        {/* -------- Meta -------- */}
        <Card>
          <CardContent className="grid grid-cols-3 gap-4">
            <div>
              <label>Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border p-2 rounded"
              >
                {QUESTION_TYPES.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(+e.target.value)}
                className="w-full border p-2 rounded"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Tags</label>
              <Input
                value={tags.join(",")}
                onChange={(e) =>
                  setTags(e.target.value.split(",").map((x) => x.trim()))
                }
                placeholder="tag1,tag2"
              />
            </div>
          </CardContent>
        </Card>
  
        {/* -------- Content Blocks -------- */}
        <Card>
          <CardContent>
            <h2 className="font-semibold mb-2">Content Blocks</h2>
            {content.map((blk, idx) =>
              renderBlock(
                blk,
                idx,
                (key, value) => {
                  const c = [...content];
                  (c[idx] as any)[key] = value;
                  setContent(c);
                },
                (key, value) => {
                  const c = [...content];
                  c[idx].data = { ...c[idx].data, [key]: value };
                  setContent(c);
                },
                () => removeContentBlock(idx)
              )
            )}
            <Button onClick={addContentBlock}>+ Add Block</Button>
          </CardContent>
        </Card>
  
        {/* -------- Options -------- */}
        {!["two-part-analysis", "multi-source-reasoning", "reading-comprehension"].includes(
          type
        ) && (
          <Card>
            <CardContent>
              <h2 className="font-semibold mb-2">Options</h2>
              {options.map((opt, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <Input
                    value={opt.id}
                    onChange={(e) => {
                      const o = [...options];
                      o[idx].id = e.target.value;
                      setOptions(o);
                    }}
                    className="w-12"
                  />
                  <Textarea
                    value={opt.blocks[0]?.text || ""}
                    onChange={(e) => {
                      const o = [...options];
                      o[idx].blocks[0].text = e.target.value;
                      setOptions(o);
                    }}
                  />
                  <input
                    type="radio"
                    name="correct"
                    checked={answers.correct_option_id === opt.id}
                    onChange={() =>
                      setAnswers({ correct_option_id: opt.id })
                    }
                  />
                  <button
                    onClick={() => removeOptionBlock(idx)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <Button onClick={addOptionBlock}>+ Add Option</Button>
            </CardContent>
          </Card>
        )}
  
        {/* -------- Grid Answer Picker -------- */}
        {content.some((b) => b.type === "matrix" || b.type === "ds_grid") && (
          <Card>
            <CardContent>
              <h2 className="font-semibold mb-2">Select Correct Grid Answers (Multiple)</h2>
              {[0, 1].map((pairIdx) => (
                <div key={pairIdx} className="flex gap-4 mb-2">
                  <div>
                    <label>Row</label>
                    <select
                      value={answers.selected_pairs?.[pairIdx]?.row_index || 0}
                      onChange={(e) => {
                        const updated = answers.selected_pairs
                          ? [...answers.selected_pairs]
                          : [];
                        updated[pairIdx] = {
                          row_index: +e.target.value,
                          column_index:
                            updated[pairIdx]?.column_index || 0,
                        };
                        setAnswers({ ...answers, selected_pairs: updated });
                      }}
                    >
                      {content.find(
                        (b) => b.type === "matrix" || b.type === "ds_grid"
                      )?.row_headers?.map((h: string, i: number) => (
                        <option key={i} value={i}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Column</label>
                    <select
                      value={answers.selected_pairs?.[pairIdx]?.column_index || 0}
                      onChange={(e) => {
                        const updated = answers.selected_pairs
                          ? [...answers.selected_pairs]
                          : [];
                        updated[pairIdx] = {
                          row_index:
                            updated[pairIdx]?.row_index || 0,
                          column_index: +e.target.value,
                        };
                        setAnswers({ ...answers, selected_pairs: updated });
                      }}
                    >
                      {content.find(
                        (b) => b.type === "matrix" || b.type === "ds_grid"
                      )?.col_headers?.map((h: string, i: number) => (
                        <option key={i} value={i}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
  
        {/* -------- Two-Part Analysis -------- */}
        {type === "two-part-analysis" && (
          <Card>
            <CardContent>
              <h2 className="font-semibold mb-2">Two-Part Analysis Selections</h2>
              {content
                .filter((blk) => blk.type === "dropdown")
                .map((blk, i) => (
                  <div key={i}>
                    <label>{blk.data?.placeholder || "Dropdown"}</label>
                    <select
                      value={twoPartSelections[i]?.row_index || 0}
                      onChange={(e) =>
                        updateAnswerForTwoPart(i, +e.target.value)
                      }
                    >
                      {blk.data?.options?.map((opt: string, j: number) => (
                        <option key={j} value={j}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
            </CardContent>
          </Card>
        )}
  
        {/* -------- Sub-Questions -------- */}
        {(type === "multi-source-reasoning" ||
          type === "reading-comprehension") && (
          <Card>
            <CardContent>
              <h2 className="font-semibold mb-2">Sub-Questions</h2>
              <Button onClick={addSubQuestion}>+ Add Sub-Question</Button>
              {subQuestions.map((sq, si) => (
                <div key={si} className="border rounded p-3 my-3 space-y-2">
                  <div className="flex justify-between">
                    <select
                      value={sq.type}
                      onChange={(e) => {
                        const subs = [...subQuestions];
                        subs[si].type = e.target.value;
                        setSubQuestions(subs);
                      }}
                    >
                      {QUESTION_TYPES.filter((q) => q !== type).map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeSubQuestion(si)}
                      className="text-red-500"
                    >
                      Remove Sub
                    </button>
                  </div>
                  <Input
                    placeholder="Sub-question tags"
                    value={sq.tags.join(",")}
                    onChange={(e) => {
                      const subs = [...subQuestions];
                      subs[si].tags = e.target.value
                        .split(",")
                        .map((x) => x.trim());
                      setSubQuestions(subs);
                    }}
                  />
                  {sq.content.map((blk, idx) =>
                    renderBlock(
                      blk,
                      idx,
                      (key, value) => {
                        const subs = [...subQuestions];
                        (subs[si].content[idx] as any)[key] = value;
                        setSubQuestions(subs);
                      },
                      (key, value) => {
                        const subs = [...subQuestions];
                        subs[si].content[idx].data = {
                          ...subs[si].content[idx].data,
                          [key]: value,
                        };
                        setSubQuestions(subs);
                      },
                      () => {
                        const subs = [...subQuestions];
                        subs[si].content = subs[si].content.filter(
                          (_, bidx) => bidx !== idx
                        );
                        setSubQuestions(subs);
                      }
                    )
                  )}
                  <Button
                    onClick={() => {
                      const subs = [...subQuestions];
                      subs[si].content.push({ type: "paragraph" });
                      setSubQuestions(subs);
                    }}
                  >
                    + Add Content Block
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
  
        {/* -------- Submit -------- */}
        <div className="flex justify-end">
          <Button onClick={handleSubmit}>Create Question</Button>
        </div>
      </div>
    );
  }
  

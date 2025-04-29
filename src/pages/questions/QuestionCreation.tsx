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

export default function QuestionCreator() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [type, setType] = useState<string>(QUESTION_TYPES[0]);
  const [difficulty, setDifficulty] = useState<number>(1);
  const [tags, setTags] = useState<string[]>([]);

  // Parent content blocks
  const [content, setContent] = useState<ContentBlock[]>([]);
  // Single-choice options & answer
  const [options, setOptions] = useState<OptionType[]>([]);
  const [answers, setAnswers] = useState<AnswerSchema>({});
  // Two-part analysis selections
  const [twoPartSelections, setTwoPartSelections] = useState<{ row_index: number; column_index: number }[]>([]);
  // Grid answer selection (for matrix/ds_grid)
  const [gridSelection, setGridSelection] = useState<{ row: number; col: number } | null>({ row: 0, col: 0 });
  // Composite sub-questions
  const [subQuestions, setSubQuestions] = useState<{
    content: ContentBlock[];
    options: OptionType[];
    answers: AnswerSchema;
  }[]>([]);

  // Update block field
  const updateBlock = (
    forSub: number | null,
    idx: number,
    key: keyof ContentBlock,
    value: any
  ) => {
    if (forSub === null) {
      const arr = [...content];
      (arr[idx] as any)[key] = value;
      setContent(arr);
    } else {
      const subs = [...subQuestions];
      (subs[forSub].content[idx] as any)[key] = value;
      setSubQuestions(subs);
    }
  };
  // Update block data
  const updateBlockData = (
    forSub: number | null,
    idx: number,
    key: string,
    value: any
  ) => {
    if (forSub === null) {
      const arr = [...content];
      arr[idx].data = { ...arr[idx].data, [key]: value };
      setContent(arr);
    } else {
      const subs = [...subQuestions];
      subs[forSub].content[idx].data = {
        ...subs[forSub].content[idx].data,
        [key]: value,
      };
      setSubQuestions(subs);
    }
  };

  const addContent = (forSub?: number) => {
    const blk: ContentBlock = { type: "paragraph" };
    if (forSub == null) setContent([...content, blk]);
    else {
      const subs = [...subQuestions];
      subs[forSub].content.push(blk);
      setSubQuestions(subs);
    }
  };
  const addOption = (forSub?: number) => {
    const opt: OptionType = { id: "A", blocks: [{ type: "paragraph", text: "" }] };
    if (forSub == null) setOptions([...options, opt]);
    else {
      const subs = [...subQuestions];
      subs[forSub].options.push(opt);
      setSubQuestions(subs);
    }
  };
  const addSubQuestion = () =>
    setSubQuestions([...subQuestions, { content: [], options: [], answers: {} }]);

  // Submit handler
  const handleSubmit = async () => {
    try {
      let url: string;
      let payload: any;
      // prepare full answers
      const fullAnswers: AnswerSchema = { ...answers };
      if (type === "two-part-analysis") {
        fullAnswers.selected_pairs = twoPartSelections;
      }
      if (content.some(b => b.type === "matrix" || b.type === "ds_grid")) {
        if (gridSelection)
          fullAnswers.selected_pairs = [
            { row_index: gridSelection.row, column_index: gridSelection.col },
          ];
      }

      const BASE_URL = import.meta.env.VITE_API_URL
      if (["multi-source-reasoning", "reading-comprehension"].includes(type)) {
        url = `${BASE_URL}/api/questions/bulk`;
        payload = [
          { type, content, options: [], answers: { correct_option_id: null }, tags, difficulty },
          ...subQuestions.map((sq, i) => ({
            type: "single-choice",
            order: i + 1,
            content: sq.content,
            options: sq.options,
            answers: sq.answers,
            tags,
            difficulty,
          })),
        ];
      } else {
        url = `${BASE_URL}/api/questions`;
        payload = { type, content, options, answers: fullAnswers, tags, difficulty };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      navigate("/app/questions");
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Block editor
  const renderBlock = (
    blk: ContentBlock,
    idx: number,
    forSub?: number
  ) => (
    <div key={idx} className="mt-4 border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <select
          value={blk.type}
          className="border rounded p-1 bg-gray-50"
          onChange={e =>
            updateBlock(forSub ?? null, idx, "type", e.target.value)
          }
        >
          {[
            "paragraph",
            "image",
            "table",
            "list",
            "dropdown",
            "numeric",
            "matrix",
            "ds_grid",
          ].map(t => (
            <option key={t} value={t}>
              {t.replace(/-/g, " ")}
            </option>
          ))}
        </select>
        <Button size="sm" onClick={() => addContent(forSub)}>
          + Block
        </Button>
      </div>

      {blk.type === "paragraph" && (
        <Textarea
          rows={4}
          className="w-full"
          placeholder="Enter paragraph text..."
          value={blk.text || ""}
          onChange={e =>
            updateBlock(forSub ?? null, idx, "text", e.target.value)
          }
        />
      )}

      {blk.type === "image" && (
        <div className="space-y-2">
          <Input
            placeholder="Image URL (e.g. https://...)"
            value={(blk as any).url || ""}
            onChange={e =>
              updateBlock(forSub ?? null, idx, "url", e.target.value)
            }
          />
          <Input
            placeholder="Alt text (required)"
            value={(blk as any).alt || ""}
            onChange={e =>
              updateBlock(forSub ?? null, idx, "alt", e.target.value)
            }
          />
        </div>
      )}

      {blk.type === "table" && (
        <div className="space-y-2">
          <Input
            placeholder="Headers, comma-separated (e.g. Dept,Revenue,Cost)"
            value={(blk.headers || []).join(",")}
            onChange={e =>
              updateBlock(forSub ?? null, idx, "headers", e.target.value.split(","))
            }
          />
          <Textarea
            rows={4}
            placeholder={
              "Rows per line, comma-separated (e.g. A,120,70)"
            }
            value={((blk.rows || []) as string[][])
              .map(r => r.join(","))
              .join("\n")}
            onChange={e =>
              updateBlock(
                forSub ?? null,
                idx,
                "rows",
                e.target.value
                  .split("\n")
                  .map(line => line.split(","))
              )
            }
          />
        </div>
      )}

      {blk.type === "list" && (
        <Textarea
          rows={4}
          placeholder="One item per line (e.g. Apple)"
          value={(blk.data?.items || []).join("\n")}
          onChange={e =>
            updateBlockData(
              forSub ?? null,
              idx,
              "items",
              e.target.value.split("\n")
            )
          }
        />
      )}

      {blk.type === "dropdown" && (
        <div className="space-y-2">
          <Input
            placeholder="Placeholder text (e.g. Select X%)"
            value={blk.data?.placeholder || ""}
            onChange={e =>
              updateBlockData(
                forSub ?? null,
                idx,
                "placeholder",
                e.target.value
              )
            }
          />
          <Textarea
            rows={3}
            placeholder="Options, comma-separated (e.g. 20%,30%,40%)"
            value={(blk.data?.options || []).join(",")}
            onChange={e =>
              updateBlockData(
                forSub ?? null,
                idx,
                "options",
                e.target.value.split(",")
              )
            }
          />
        </div>
      )}

      {blk.type === "numeric" && (
        <Input
          type="number"
          placeholder="Numeric placeholder (e.g. Enter value)"
          value={blk.data?.placeholder || ""}
          onChange={e =>
            updateBlockData(
              forSub ?? null,
              idx,
              "placeholder",
              e.target.value
            )
          }
        />
      )}

      {(blk.type === "matrix" || blk.type === "ds_grid") && (
        <div className="space-y-2">
          <Input
            placeholder="Row headers, comma-separated (e.g. 10,30,50)"
            value={(blk.data?.row_headers || []).join(",")}
            onChange={e =>
              updateBlockData(
                forSub ?? null,
                idx,
                "row_headers",
                e.target.value.split(",")
              )
            }
          />
          <p className="text-xs text-gray-500">
            Separate each row header with a comma.
          </p>
          <Input
            placeholder="Column headers, comma-separated (e.g. Fee,Rate)"
            value={(blk.data?.col_headers || []).join(",")}
            onChange={e =>
              updateBlockData(
                forSub ?? null,
                idx,
                "col_headers",
                e.target.value.split(",")
              )
            }
          />
          <p className="text-xs text-gray-500">
            Helps define the grid for matrix/DS-grid answers.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">New GMAT Question</h1>

      {/* Meta */}
      <Card>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="mt-1 block w-full border rounded p-2 bg-gray-50"
              >
                {QUESTION_TYPES.map(q => (
                  <option key={q} value={q}>
                    {q.replace(/-/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Difficulty</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(+e.target.value)}
                className="mt-1 block w-full border rounded p-2 bg-gray-50"
              >
                {[1, 2, 3, 4, 5, 6, 7].map(n => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Tags</label>
              <Input
                className="mt-1 block w-full"
                placeholder="tag1,tag2,..."
                value={tags.join(",")}
                onChange={e =>
                  setTags(e.target.value.split(",").map(t => t.trim()))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Blocks */}
      <Card>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Content Blocks</h2>
            <Button size="sm" onClick={() => addContent()}>
              + Add Block
            </Button>
          </div>
          {content.map((blk, idx) => renderBlock(blk, idx))}
        </CardContent>
      </Card>

      {/* Single-choice Options */}
      {!["two-part-analysis", "multi-source-reasoning", "reading-comprehension"].includes(
        type
      ) && (
        <Card>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Options & Answer</h2>
              <Button size="sm" onClick={() => addOption()}>
                + Add Option
              </Button>
            </div>
            {options.map((opt, j) => (
              <div
                key={j}
                className="mt-3 border rounded-lg p-3 bg-white shadow-sm"
              >
                <div className="flex gap-2 mb-2">
                  <Input
                    className="w-16"
                    value={opt.id}
                    onChange={e => {
                      const o = [...options];
                      o[j].id = e.target.value;
                      setOptions(o);
                    }}
                  />
                  <Textarea
                    rows={2}
                    className="flex-1"
                    placeholder="Option text..."
                    value={opt.blocks[0].text || ""}
                    onChange={e => {
                      const o = [...options];
                      o[j].blocks[0].text = e.target.value;
                      setOptions(o);
                    }}
                  />
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="correct"
                    className="mr-2"
                    checked={answers.correct_option_id === opt.id}
                    onChange={() => setAnswers({ correct_option_id: opt.id })}
                  />
                  Mark as correct
                </label>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Two-Part Analysis Answers */}
      {type === "two-part-analysis" && (
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold mb-2">Two-Part Analysis</h2>
            {content
              .filter(b => b.type === "dropdown")
              .map((blk, i) => (
                <div key={i} className="mt-2">
                  <label className="block text-sm">{blk.data?.placeholder}</label>
                  <select
                    className="mt-1 block w-full border rounded p-2 bg-gray-50"
                    value={twoPartSelections[i]?.row_index || 0}
                    onChange={e => {
                      const sel = [...twoPartSelections];
                      sel[i] = { row_index: +e.target.value, column_index: 0 };
                      setTwoPartSelections(sel);
                    }}
                  >
                    {blk.data?.options?.map((opt: string, j: number) => (
                      <option key={j} value={j}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            {content
              .filter(b => b.type === "numeric")
              .map((blk, i) => (
                <div key={i} className="mt-4">
                  <label className="block text-sm">{blk.data?.placeholder}</label>
                  <Input
                    type="number"
                    className="mt-1 w-full"
                    placeholder="Enter number"
                    onChange={e =>
                      setTwoPartSelections([
                        { row_index: +e.target.value, column_index: 0 },
                      ])
                    }
                  />
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      {/* Composite Sub-Questions */}
      {(type === "multi-source-reasoning" || type === "reading-comprehension") && (
        <Card>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Sub-Questions</h2>
              <Button size="sm" onClick={addSubQuestion}>
                + Add Sub-question
              </Button>
            </div>
            {subQuestions.map((sub, si) => (
              <div
                key={si}
                className="mt-4 border rounded-lg p-4 bg-white shadow-sm"
              >
                <h3 className="font-medium mb-2">Sub-question #{si + 1}</h3>
                {sub.content.map((blk, bi) => renderBlock(blk, bi, si))}
                <Button size="sm" onClick={() => addOption(si)}>
                  + Option
                </Button>
                {sub.options.map((opt, j) => (
                  <div key={j} className="mt-2">
                    <div className="flex gap-2 mb-1">
                      <Input
                        className="w-12"
                        value={opt.id}
                        onChange={e => {
                          const ss = [...subQuestions];
                          ss[si].options[j].id = e.target.value;
                          setSubQuestions(ss);
                        }}
                      />
                      <Textarea
                        rows={2}
                        className="flex-1"
                        placeholder="Option text..."
                        value={opt.blocks[0].text || ""}
                        onChange={e => {
                          const ss = [...subQuestions];
                          ss[si].options[j].blocks[0].text = e.target.value;
                          setSubQuestions(ss);
                        }}
                      />
                    </div>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`sub${si}`}
                        className="mr-2"
                        checked={sub.answers.correct_option_id === opt.id}
                        onChange={() => {
                          const ss = [...subQuestions];
                          ss[si].answers = { correct_option_id: opt.id };
                          setSubQuestions(ss);
                        }}
                      />
                      Correct
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Grid Answer Picker */}
      {(content.some(b => b.type === "matrix" || b.type === "ds_grid")) && (
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold mb-2">Grid Answer Picker</h2>
            <p className="text-xs text-gray-500 mb-2">
              Select the correct cell from the dropdowns below.
            </p>
            <div className="flex gap-4">
              <div>
                <label className="block text-sm">Row</label>
                <select
                  className="mt-1 block border rounded p-2 bg-gray-50"
                  value={gridSelection?.row}
                  onChange={e =>
                    setGridSelection({
                      row: +e.target.value,
                      col: gridSelection!.col,
                    })
                  }
                >
                  {content
                    .find(b => b.type === "matrix" || b.type === "ds_grid")
                    ?.data?.row_headers?.map((h: string, i: number) => (
                      <option key={i} value={i}>
                        {h}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm">Column</label>
                <select
                  className="mt-1 block border rounded p-2 bg-gray-50"
                  value={gridSelection?.col}
                  onChange={e =>
                    setGridSelection({
                      row: gridSelection!.row,
                      col: +e.target.value,
                    })
                  }
                >
                  {content
                    .find(b => b.type === "matrix" || b.type === "ds_grid")
                    ?.data?.col_headers?.map((h: string, i: number) => (
                      <option key={i} value={i}>
                        {h}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button onClick={handleSubmit}>Create Question</Button>
      </div>
    </div>
  );
}

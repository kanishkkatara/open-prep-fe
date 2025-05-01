// src/components/question/PassageDisplay.tsx

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "../../components/ui/Card";
import type { ContentBlock } from "../../lib/types";

interface PassageDisplayProps {
  blocks: ContentBlock[];
  questionType: string; // now required
}

const sectionLabels: Record<string, string> = {
  "multi-source-reasoning": "Multi-Source Reasoning",
  "reading-comprehension": "Reading Comprehension",
  "critical-reasoning": "Critical Reasoning",
  "data-sufficiency": "Data Sufficiency",
  "problem-solving": "Problem Solving",
  // add more if needed
};

const PassageDisplay: React.FC<PassageDisplayProps> = ({ blocks, questionType }) => {
  // --- Group blocks into tab-indexed sources ---
  const sources = useMemo(() => {
    const map = new Map<number, ContentBlock[]>();
    (blocks || []).forEach((blk) => {
      let ti = blk.data?.tabIndex;
      if (typeof ti === "string") ti = parseInt(ti, 10);
      if (typeof ti !== "number" || isNaN(ti)) ti = 0;
      if (!map.has(ti)) map.set(ti, []);
      map.get(ti)!.push(blk);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a - b)
      .map(([idx, blks]) => ({ idx, blks }));
  }, [blocks]);

  // Active tab
  const [active, setActive] = useState(0);

  // --- Block renderer ---
  const renderBlock = (blk: ContentBlock, i: number) => {
    switch (blk.type) {
      case "paragraph":
        return (
          <p key={i} className="text-gray-800 mb-4 whitespace-pre-line">
            {blk.text}
          </p>
        );
      case "table":
        return (
          <table key={i} className="mb-4 w-full border">
            <thead className="bg-gray-100">
              <tr>
                {blk.headers?.map((h, j) => (
                  <th key={j} className="px-2 py-1 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {blk.rows?.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c} className="border px-2 py-1">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "image":
        return (
          <img
            key={i}
            src={blk.url}
            alt={blk.alt || ""}
            className="mb-4 max-w-full rounded"
          />
        );
      case "list":
        return (
          <ul key={i} className="mb-4 list-disc list-inside">
            {blk.data?.items?.map((it: string, k: number) => (
              <li key={k}>{it}</li>
            ))}
          </ul>
        );
      default:
        return (
          <div key={i} className="text-red-500 mb-4">
            [Unsupported block: {blk.type}]
          </div>
        );
    }
  };

  // --- Tabs only for MSR if multiple sources ---
  const showTabs = questionType === "multi-source-reasoning" && sources.length > 1;

  return (
    <Card>
      <CardContent>
        {/* Tabs */}
        {showTabs && (
          <div className="mb-4 flex space-x-2 border-b">
            {sources.map((src, idx) => (
              <button
                key={src.idx}
                onClick={() => setActive(idx)}
                className={
                  active === idx
                    ? "pb-2 border-b-2 border-blue-500 font-medium text-blue-600"
                    : "pb-2 border-b-2 border-transparent text-gray-600 hover:text-gray-800"
                }
              >
                Source {idx + 1}
              </button>
            ))}
          </div>
        )}

        {/* Active source blocks */}
        <div>
          {sources.length > 0 && sources[active]
            ? sources[active].blks.map((blk, i) => renderBlock(blk, i))
            : <p className="text-gray-500">No content available for this passage.</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default PassageDisplay;

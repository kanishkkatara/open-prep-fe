// src/components/question/PassageDisplay.tsx

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "../../components/ui/Card";
import type { ContentBlock } from "../../lib/types";

interface PassageDisplayProps {
  blocks: ContentBlock[];
  questionType: string; // now required
}

const PassageDisplay: React.FC<PassageDisplayProps> = ({
  blocks,
  questionType,
}) => {
  // --- Group blocks into tab-indexed sources ---
  const sources = useMemo(() => {
    const map = new Map<number, { blks: ContentBlock[]; title?: string }>();
    (blocks || []).forEach((blk) => {
      let ti = blk.data?.tabIndex;
      let title = blk.data?.tabTitle;
      if (typeof ti === "string") ti = parseInt(ti, 10);
      if (typeof ti !== "number" || isNaN(ti)) ti = 0;
      if (!map.has(ti)) {
        map.set(ti, { blks: [], title });
      }
      map.get(ti)!.blks.push(blk);
      // If title is missing but this block has it, set it.
      if (!map.get(ti)!.title && title) {
        map.get(ti)!.title = title;
      }
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => a - b)
      .map(([idx, data]) => ({ idx, blks: data.blks, title: data.title }));
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
                  <th key={j} className="px-2 py-1 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {blk.rows?.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c} className="border px-2 py-1">
                      {cell}
                    </td>
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
  const showTabs =
    questionType === "multi-source-reasoning" && sources.length > 1;

  return (
    <Card>
      <CardContent>
        {/* Tabs */}
        {showTabs && (
          <div className="mb-4 flex border-b">
            {sources.map((src, idx) => (
              <React.Fragment key={src.idx}>
                <button
                  onClick={() => setActive(idx)}
                  className={
                    active === idx
                      ? "pb-2 px-4 border-b-2 border-blue-500 font-medium text-blue-600"
                      : "pb-2 px-4 border-b-2 border-transparent text-gray-600 hover:text-gray-800"
                  }
                >
                  {src.title || `Source ${idx + 1}`}
                </button>
                {/* Render vertical divider except after last tab */}
                {idx < sources.length - 1 && (
                  <div className="border-l h-5 mx-2 border-gray-300" />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Active source blocks */}
        <div>
          {sources.length > 0 && sources[active] ? (
            sources[active].blks.map((blk, i) => renderBlock(blk, i))
          ) : (
            <p className="text-gray-500">
              No content available for this passage.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PassageDisplay;

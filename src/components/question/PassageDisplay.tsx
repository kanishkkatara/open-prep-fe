// File: src/components/question/PassageDisplay.tsx

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "../../components/ui/Card";
import type { ContentBlock, Annotation } from "../../lib/types";

interface PassageDisplayProps {
  blocks: ContentBlock[];
  questionType: string;
  annotations?: Annotation[];
}

const PassageDisplay: React.FC<PassageDisplayProps> = ({
  blocks,
  questionType,
  annotations = [],
}) => {
  // --- Group blocks into tab-indexed sources ---
  const sources = useMemo(() => {
    const map = new Map<number, { blks: ContentBlock[]; title?: string }>();
    (blocks || []).forEach((blk) => {
      let ti = blk.data?.tabIndex;
      let title = blk.data?.tabTitle;
      if (typeof ti === "string") ti = parseInt(ti, 10);
      if (typeof ti !== "number" || isNaN(ti)) ti = 0;
      if (!map.has(ti)) map.set(ti, { blks: [], title });
      map.get(ti)!.blks.push(blk);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a - b)
      .map(([idx, data]) => ({ idx, blks: data.blks, title: data.title }));
  }, [blocks]);

  const [active, setActive] = useState(0);

  // ─── Render each block, applying annotations for paragraphs ───
  const renderBlock = (blk: ContentBlock, blockIndex: number) => {
    if (blk.type === "paragraph") {
      console.log("annotations", annotations);
      const spans = annotations
        .filter((a) => a.blockIndex === blockIndex)
        .sort((a, b) => a.charStart - b.charStart);
      console.log("spans", spans);
      if (!spans.length) {
        return (
          <p key={blockIndex} className="text-gray-800 mb-4 whitespace-pre-line">
            {blk.text}
          </p>
        );
      }

      const pieces: React.ReactNode[] = [];
      let cursor = 0;
      spans.forEach((a, i) => {
        if (a.charStart > cursor) {
          pieces.push(blk.text.slice(cursor, a.charStart));
        }
        const slice = blk.text.slice(a.charStart, a.charEnd);
        console.log("slice", slice);
        pieces.push(
          a.annotationType === "highlight" ? (
            <mark key={i}>{slice}</mark>
          ) : (
            <strong key={i}>{slice}</strong>
          )
        );
        cursor = a.charEnd;
      });
      if (cursor < (blk.text || "").length) {
        pieces.push((blk.text || "").slice(cursor));
      }

      return (
        <p key={blockIndex} className="text-gray-800 mb-4 whitespace-pre-line">
          {pieces}
        </p>
      );
    }

    // ─── Other block types unchanged ─────────────────────────────
    switch (blk.type) {
      case "table":
        return (
          <table key={blockIndex} className="mb-4 w-full border">
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
            key={blockIndex}
            src={blk.url}
            alt={blk.alt || ""}
            className="mb-4 max-w-full rounded"
          />
        );
      case "list":
        return (
          <ul key={blockIndex} className="mb-4 list-disc list-inside">
            {blk.data?.items?.map((it, k) => (
              <li key={k}>{it}</li>
            ))}
          </ul>
        );
      default:
        return (
          <div key={blockIndex} className="text-red-500 mb-4">
            [Unsupported block: {blk.type}]
          </div>
        );
    }
  };

  const showTabs =
    questionType === "multi-source-reasoning" && sources.length > 1;

  return (
    <Card>
      <CardContent>
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
                {idx < sources.length - 1 && (
                  <div className="border-l h-5 mx-2 border-gray-300" />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        <div>
          {sources[active]?.blks.map((blk) => {
            const globalIdx = blocks.findIndex((b) => b === blk);
            return renderBlock(blk, globalIdx);
          }) || (
            <p className="text-gray-500">No content available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PassageDisplay;

import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Card, CardContent } from '../../components/ui/Card';
import type { ContentBlock, CellCoordinate, SingleQuestion } from '../../lib/types';

interface QuestionDisplayProps {
  question: SingleQuestion;
  selectedAnswer: string | null;
  selectedGrid: CellCoordinate[];
  onSelectAnswer: (id: string) => void;
  onSelectGrid: (row: number, col: number) => void;
  isSubmitted: boolean;
}

// Replace inline LaTeX delimiters with rendered HTML, defaulting to empty string
const renderContent = (text: string = ''): string => {
  return text.replace(/\\\((.+?)\\\)/g, (_, expr) =>
    katex.renderToString(expr, { throwOnError: false })
  );
};

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  selectedAnswer,
  selectedGrid,
  onSelectAnswer,
  onSelectGrid,
  isSubmitted,
}) => {
  const { type, content, options, answers } = question;
  const correctAnswer = answers.correct_option_id || null;
  const correctPairs = answers.selected_pairs || [];

  function renderBlock(block: ContentBlock, idx: number) {
    switch (block.type) {
      case 'paragraph':
        return (
          <p
            key={idx}
            className="text-gray-800 text-lg mb-4 whitespace-pre-line"
            dangerouslySetInnerHTML={{
              __html: renderContent(block.text),
            }}
          />
        );
      case 'image':
        return (
          <img
            key={idx}
            src={block.url}
            alt={block.alt || ''}
            className="mb-4 max-w-full rounded"
          />
        );
      case 'table':
        return (
          <table key={idx} className="mb-4 w-full border-collapse">
            <thead>
              <tr>
                {block.headers?.map((h, j) => (
                  <th key={j} className="border px-2 py-1 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows?.map((row, r) => (
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
      case 'matrix':
        return (
          <div key={idx} className="mb-4 p-4 bg-gray-50 rounded overflow-auto">
            {/* render matrix */}
          </div>
        );

      case 'ds_grid': {
        const ds = block as any;
        return (
          <div key={idx} className="mb-4 overflow-auto">
            <table className="min-w-full table-fixed border-collapse">
              <thead>
                <tr>
                  <th className="border px-2 py-1"></th>
                  {ds.col_headers.map((col: string, ci: number) => (
                    <th
                      key={ci}
                      className="border px-2 py-1 text-center font-medium"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ds.row_headers.map((row: string, ri: number) => (
                  <tr key={ri} className="hover:bg-gray-50">
                    <th className="border px-2 py-1 text-left font-medium">
                      {row}
                    </th>
                    {ds.col_headers.map((_: any, ci: number) => {
                      const isSel = selectedGrid.some(
                        p => p.row_index === ri && p.column_index === ci
                      );
                      const isCorr = correctPairs.some(
                        p => p.row_index === ri && p.column_index === ci
                      );
                      let bg = '';
                      if (isSubmitted) {
                        if (isCorr) bg = 'bg-green-100 border-green-500';
                        else if (isSel) bg = 'bg-red-100 border-red-500';
                      }
                      return (
                        <td
                          key={ci}
                          className={`border px-2 py-6 text-center cursor-pointer ${bg}`}
                          onClick={() => !isSubmitted && onSelectGrid(ri, ci)}
                        >
                          <input
                            type="radio"
                            name={`grid-col-${ci}`}
                            checked={isSel}
                            disabled={isSubmitted}
                            onChange={() => onSelectGrid(ri, ci)}
                            className="mx-auto"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      default:
        return null;
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6">
          {content.map(renderBlock)}
        </div>

        {/* Options or grid */}
        {type === 'two-part-analysis' ? (
          // grid handled above via renderBlock('ds_grid')
          null
        ) : (
          <div className="space-y-3 mt-6">
            {options.map(opt => {
              const isSel = selectedAnswer === opt.id;
              const isCorr = correctAnswer === opt.id;
              let borderClass = isSel
                ? 'border-blue-500'
                : 'border-gray-300 hover:border-blue-300';
              let bgClass = '';
              if (!isSubmitted && isSel) bgClass = 'bg-blue-50';
              if (isSubmitted) {
                if (isCorr) bgClass = 'bg-green-50';
                else if (isSel) bgClass = 'bg-red-50';
              }
              return (
                <label
                  key={opt.id}
                  className={`flex items-start border rounded-lg p-4 cursor-pointer transition-all ${borderClass} ${bgClass}`}
                >
                  <input
                    type="radio"
                    name="mcq"
                    value={opt.id}
                    checked={isSel}
                    disabled={isSubmitted}
                    onChange={() => onSelectAnswer(opt.id)}
                    className="mr-3 mt-1"
                  />
                  <div className="flex-1">
                    {opt.blocks.map((b, i) => (
                      <React.Fragment key={i}>{renderBlock(b, i)}</React.Fragment>
                    ))}
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionDisplay;

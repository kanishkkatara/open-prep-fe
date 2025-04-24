// src/components/question/QuestionDisplay.tsx

import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { ContentBlock, Option } from '../../lib/types';

interface QuestionDisplayProps {
  id: string;
  type: string;
  content: ContentBlock[];
  options: Option[];
  selectedAnswer: string | null;
  onSelectAnswer: (id: string) => void;
  isSubmitted: boolean;
  correctAnswer?: string | null;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  type,
  content,
  options,
  selectedAnswer,
  onSelectAnswer,
  isSubmitted,
  correctAnswer,
}) => {
  const isDataSufficiency = type === 'data-sufficiency';

  const getOptionClass = (optionId: string) => {
    if (!isSubmitted) {
      return selectedAnswer === optionId
        ? 'bg-blue-50 border-blue-500'
        : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50';
    }
    if (correctAnswer === optionId) {
      return 'bg-green-50 border-green-500';
    }
    if (selectedAnswer === optionId && selectedAnswer !== correctAnswer) {
      return 'bg-red-50 border-red-500';
    }
    return 'border-gray-300 opacity-70';
  };

  const renderBlock = (block: ContentBlock, idx: number) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p key={idx} className="text-gray-800 text-lg mb-4 whitespace-pre-line">
            {block.text}
          </p>
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
      case 'list':
        return (
          <ul key={idx} className="mb-4 list-disc list-inside">
            {block.data?.items?.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
      // you can add cases for 'dropdown', 'numeric', etc.
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6">
          <div className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
            {type === 'problem-solving' ? 'Problem Solving' : 'Data Sufficiency'}
          </div>

          {/* RENDER RICH CONTENT */}
          {content.map((blk, i) => renderBlock(blk, i))}
        </div>

        {/* OPTIONS */}
        <div className="space-y-3 mt-6">
          {options.map((opt) => (
            <div
              key={opt.id}
              className={`border rounded-lg p-4 transition-all cursor-pointer ${getOptionClass(
                opt.id
              )}`}
              onClick={() => !isSubmitted && onSelectAnswer(opt.id)}
            >
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0 border border-current">
                  <span className="text-sm font-medium">{opt.id}</span>
                </div>
                <div className="flex-1">
                  {opt.blocks.map((blk, i) => (
                    <React.Fragment key={i}>{renderBlock(blk, i)}</React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DATA SUFFICIENCY SIDEBAR */}
        {isDataSufficiency && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">
              Data Sufficiency Answer Key
            </h4>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>A: Statement (1) ALONE is sufficient, but statement (2) ALONE is not sufficient.</li>
              <li>B: Statement (2) ALONE is sufficient, but statement (1) ALONE is not sufficient.</li>
              <li>C: BOTH statements TOGETHER are sufficient, but NEITHER statement ALONE is sufficient.</li>
              <li>D: EACH statement ALONE is sufficient.</li>
              <li>E: Statements (1) and (2) TOGETHER are NOT sufficient.</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionDisplay;

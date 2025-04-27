// src/components/question/QuestionDisplay.tsx

import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import type { ContentBlock, SingleQuestion } from '../../lib/types';

interface QuestionDisplayProps {
  question: SingleQuestion;
  selectedAnswer: string | null;
  onSelectAnswer: (id: string) => void;
  isSubmitted: boolean;
}

const sectionLabels: Record<string, string> = {
  'problem-solving': 'Problem Solving',
  'critical-reasoning': 'Critical Reasoning',
  'reading-comprehension': 'Reading Comprehension',
  'data-sufficiency': 'Data Sufficiency',
  'multi-source-reasoning': 'Multi-Source Reasoning',
  'table-analysis': 'Table Analysis',
  'graphics-interpretation': 'Graphics Interpretation',
  'two-part-analysis': 'Two-Part Analysis',
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
          {block.data?.items?.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case 'dropdown':
      return (
        <select key={idx} className="mb-4 block rounded border px-2 py-1">
          {block.data?.options?.map((opt: string, i: number) => (
            <option key={i}>{opt}</option>
          ))}
        </select>
      );
    case 'numeric':
      return (
        <input
          key={idx}
          type="number"
          className="mb-4 block w-32 rounded border px-2 py-1"
          placeholder="Enter number"
        />
      );
    case 'matrix':
      return (
        <div key={idx} className="mb-4 p-4 bg-gray-50 rounded">
          {/* Render matrix UI based on block.data */}
          [Matrix question]
        </div>
      );
    case 'ds_grid':
      return (
        <div key={idx} className="mb-4 p-4 bg-gray-50 rounded">
          {/* Render DS grid UI based on block.data */}
          [Data Sufficiency grid]
        </div>
      );
    default:
      return null;
  }
};

const getOptionClass = (
  optionId: string,
  selectedAnswer: string | null,
  correctAnswer: string | null,
  isSubmitted: boolean
) => {
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

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  isSubmitted,
}) => {
  const { type, content, options, answers } = question;
  const correctAnswer = answers.correct_option_id || null;
  const sectionLabel = sectionLabels[type] || 'Question';

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6">
          <div className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
            {sectionLabel}
          </div>

          {content.map((blk, i) => renderBlock(blk, i))}
        </div>

        <div className="space-y-3 mt-6">
          {options.map((opt) => (
            <div
              key={opt.id}
              className={`border rounded-lg p-4 transition-all cursor-pointer ${getOptionClass(
                opt.id,
                selectedAnswer,
                correctAnswer,
                isSubmitted
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
      </CardContent>
    </Card>
  );
};

export default QuestionDisplay;

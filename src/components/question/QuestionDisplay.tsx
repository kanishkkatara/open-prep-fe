import React from 'react';
import { Card, CardContent } from '../ui/Card';

interface QuestionOption {
  id: string;
  text: string;
}

interface QuestionDisplayProps {
  id: string;
  type: string;
  text: string;
  options: QuestionOption[];
  selectedAnswer: string | null;
  onSelectAnswer: (id: string) => void;
  isSubmitted: boolean;
  correctAnswer?: string;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  id,
  type,
  text,
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
    
    if (correctAnswer && correctAnswer === optionId) {
      return 'bg-green-50 border-green-500';
    }
    
    if (selectedAnswer === optionId && selectedAnswer !== correctAnswer) {
      return 'bg-red-50 border-red-500';
    }
    
    return 'border-gray-300 opacity-70';
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4">
          <div className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
            {type === 'problem-solving' ? 'Problem Solving' : 'Data Sufficiency'}
          </div>
          <p className="text-gray-800 text-lg whitespace-pre-line">{text}</p>
        </div>
        
        <div className="space-y-3 mt-6">
          {options.map((option) => (
            <div
              key={option.id}
              className={`border rounded-lg p-4 transition-all cursor-pointer ${getOptionClass(option.id)}`}
              onClick={() => !isSubmitted && onSelectAnswer(option.id)}
            >
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0 border border-current">
                  <span className="text-sm font-medium">{option.id}</span>
                </div>
                <span className="text-gray-800">{option.text}</span>
              </div>
            </div>
          ))}
        </div>
        
        {isDataSufficiency && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Data Sufficiency Answer Key</h4>
            <ul className="text-sm text-gray-600 space-y-1">
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
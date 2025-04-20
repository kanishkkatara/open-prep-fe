import React from 'react';
import { BarChart, BookOpen, Calculator, PieChart } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import ProgressCircle from '../ui/ProgressCircle';
import { calculateProgress } from '../../lib/utils';

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  completed: number;
  total: number;
  difficulty: string;
  estimatedTime: string;
  topics: string[];
  icon: string;
  onClick?: (id: string) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  id,
  title,
  description,
  completed,
  total,
  difficulty,
  estimatedTime,
  topics,
  icon,
  onClick,
}) => {
  const progressValue = calculateProgress(completed, total);
  
  const getIcon = () => {
    switch (icon) {
      case 'Calculator':
        return <Calculator className="text-blue-600" />;
      case 'BookOpen':
        return <BookOpen className="text-green-600" />;
      case 'BarChart':
        return <BarChart className="text-purple-600" />;
      case 'PieChart':
        return <PieChart className="text-orange-600" />;
      default:
        return <BookOpen className="text-blue-600" />;
    }
  };
  
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card 
      className="h-full transition duration-200 hover:shadow-md" 
      hoverable
      onClick={() => onClick && onClick(id)}
    >
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="h-8 w-8 rounded-md bg-blue-50 flex items-center justify-center mr-2">
                {getIcon()}
              </div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">{description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor()}`}>
                {difficulty}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {estimatedTime}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {topics.slice(0, 3).map((topic, index) => (
                <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {topic}
                </span>
              ))}
              {topics.length > 3 && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  +{topics.length - 3} more
                </span>
              )}
            </div>
          </div>
          
          <ProgressCircle
            value={progressValue}
            size={60}
            className="ml-2 flex-shrink-0"
          />
        </div>
        
        <div className="mt-2 text-sm text-gray-600">
          <span className="font-medium">{completed}</span> of <span className="font-medium">{total}</span> lessons completed
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleCard;
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface TopicData {
  topic: string;
  accuracy: number;
  questions: number;
}

interface TopicHeatMapProps {
  data: TopicData[];
}

const TopicHeatMap: React.FC<TopicHeatMapProps> = ({ data }) => {
  const getColorForAccuracy = (accuracy: number): string => {
    if (accuracy >= 80) return 'bg-green-100 border-green-500 text-green-800';
    if (accuracy >= 70) return 'bg-teal-100 border-teal-500 text-teal-800';
    if (accuracy >= 60) return 'bg-yellow-100 border-yellow-500 text-yellow-800';
    if (accuracy >= 50) return 'bg-orange-100 border-orange-500 text-orange-800';
    return 'bg-red-100 border-red-500 text-red-800';
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Topic Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.map((item, index) => (
            <div
              key={index}
              className={`p-3 rounded-md border-l-4 ${getColorForAccuracy(item.accuracy)}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-sm">{item.topic}</h4>
                  <p className="text-xs opacity-80">{item.questions} questions</p>
                </div>
                <div className="text-lg font-bold">{item.accuracy}%</div>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    item.accuracy >= 80
                      ? 'bg-green-500'
                      : item.accuracy >= 70
                      ? 'bg-teal-500'
                      : item.accuracy >= 60
                      ? 'bg-yellow-500'
                      : item.accuracy >= 50
                      ? 'bg-orange-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${item.accuracy}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicHeatMap;
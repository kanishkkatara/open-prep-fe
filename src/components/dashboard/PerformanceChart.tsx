import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface PerformanceData {
  name: string;
  score: number;
  avgTime: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Performance Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" domain={[400, 800]} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 150]} />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="score"
              stroke="#2563EB"
              activeDot={{ r: 8 }}
              strokeWidth={2}
              name="Score"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgTime"
              stroke="#7C3AED"
              strokeWidth={2}
              name="Avg Time (seconds)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Book, Calendar, Clock, Play, Target } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import ModuleCard from "../../components/dashboard/ModuleCard";
import ProgressCircle from "../../components/ui/ProgressCircle";
import { useUser } from "../../context/UserContext";
import { DashboardData, RawStudyPlanItem } from "../../lib/types";
import { getDashboard } from "../../lib/api";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [stats, setStats] = useState<DashboardData["stats"]>({
    targetScore: 0,
    timeStudied: 0,
    questionsCompleted: 0,
  });
  const [rawPlan, setRawPlan] = useState<RawStudyPlanItem[]>([]);
  const [overall, setOverall] = useState<DashboardData["overallProgress"]>({
    quantitative: 0,
    verbal: 0,
    di: 0,
    average: 0,
  });

  useEffect(() => {
    getDashboard()
      .then((data) => {
        setStats(data.stats);
        setRawPlan(data.studyPlan);
        setOverall(data.overallProgress);
      })
      .catch(console.error);
  }, []);

  const handleModuleClick = (id: string) => navigate(`/app/questions/${id}`);

  // Map rawPlan → ModuleCard props
  type MCP = React.ComponentProps<typeof ModuleCard>;
  const modules: MCP[] = rawPlan.map((item) => ({
    id: item.id,
    title: item.title,
    description:
      typeof item.description === "string"
        ? item.description
        : JSON.stringify(item.description).slice(0, 100) + "…",
    completed: item.completed ? 1 : 0,
    total: item.total,
    difficulty:
      item.difficulty === 1
        ? "Easy"
        : item.difficulty === 2
        ? "Medium"
        : "Hard",
    estimatedTime: `${item.estimatedTime}m`,
    topics: item.topics,
    icon: "BookOpen",
    onClick: handleModuleClick,
  }));

  return (
    <main className="space-y-10 px-6 py-8">

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          {
            icon: <Target />,
            label: "Target Score",
            value: `${stats.targetScore}+`,
            bg: "bg-blue-50",
            fg: "text-blue-600",
          },
          {
            icon: <Clock />,
            label: "Time Studied",
            value: `${stats.timeStudied} hrs`,
            bg: "bg-green-50",
            fg: "text-green-600",
          },
          {
            icon: <Book />,
            label: "Questions Completed",
            value: stats.questionsCompleted,
            bg: "bg-purple-50",
            fg: "text-purple-600",
          },
        ].map(({ icon, label, value, bg, fg }) => (
          <Card key={label}>
            <CardContent className="flex items-center p-4 gap-4">
              <div
                className={`p-3 rounded-lg ${bg} flex items-center justify-center`}
              >
                {React.cloneElement(icon as any, { className: fg, size: 20 })}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <h2 className="text-xl font-bold text-gray-900">{value}</h2>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Study Plan & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Study Plan */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between px-6 py-4">
            <CardTitle>Your Study Plan</CardTitle>
            {/* <Button variant="outline" size="sm" leftIcon={<Calendar size={14} />} className="whitespace-nowrap">
      Full Plan
    </Button> */}
          </CardHeader>
          <CardContent className="px-6 py-4">
            <p className="text-center text-gray-500 py-8">Coming soon</p>
          </CardContent>
          {/* <CardContent className="px-6 py-4">
            {modules.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No upcoming modules. Try a quick quiz!
              </p>
            ) : (
              <div className="flex space-x-4 overflow-x-auto snap-x snap-mandatory py-2 hide-scrollbar">
                {modules.map((mod) => (
                  <div key={mod.id} className="snap-start flex-shrink-0 w-64">
                    <ModuleCard {...mod} />
                  </div>
                ))}
              </div>
            )}
          </CardContent> */}
        </Card>

        {/* Overall Progress */}
        <Card>
          <CardHeader className="px-6 py-4">
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center px-6 py-8">
            <ProgressCircle
              value={overall.average}
              size={160}
              strokeWidth={10}
              valueClassName="text-xl"
            />
            {overall.average === 0 ? (
              <p className="mt-4 text-gray-500 text-sm">
                Answer some questions to see progress.
              </p>
            ) : (
              <div className="mt-6 w-full space-y-4">
                {[
                  { label: "Quantitative", percentage: overall.quantitative },
                  { label: "Verbal", percentage: overall.verbal },
                  { label: "Data Insights", percentage: overall.di },
                ].map(({ label, percentage }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{label}</span>
                      <span className="font-medium text-gray-900">
                        {percentage}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Dashboard;

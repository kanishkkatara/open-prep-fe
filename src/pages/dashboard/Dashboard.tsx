import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, Book, Calendar, Clock, Play, PlusCircle, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ModuleCard from '../../components/dashboard/ModuleCard';
import PerformanceChart from '../../components/dashboard/PerformanceChart';
import TopicHeatMap from '../../components/dashboard/TopicHeatMap';
import { useUser } from '../../context/UserContext';
import { AITutorProvider } from '../../context/AITutorContext';
import ChatInput from '../../components/chat/ChatInput';
import ChatMessage from '../../components/chat/ChatMessage';
import TypingIndicator from '../../components/chat/TypingIndicator';
import { useAITutor } from '../../context/AITutorContext';
import { studyModules, performanceData, topicPerformance } from '../../data/mockData';
import ProgressCircle from '../../components/ui/ProgressCircle';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  
  const handleModuleClick = (id: string) => {
    navigate(`/app/questions/${id}`);
  };
  
  return (
    <AITutorProvider>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}! Here's your study progress.</p>
          </div>
          <Button
            leftIcon={<Play size={16} />}
            onClick={() => navigate('/app/questions/q1')}
          >
            Resume Learning
          </Button>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Target Score</p>
                  <h3 className="text-2xl font-bold text-gray-900">720+</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Time Studied</p>
                  <h3 className="text-2xl font-bold text-gray-900">43.5 hours</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mr-4">
                  <Book className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Questions Completed</p>
                  <h3 className="text-2xl font-bold text-gray-900">345</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Study Plan and Overall Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Your Study Plan</CardTitle>
                <Button variant="outline" size="sm" leftIcon={<Calendar size={14} />}>
                  View Full Plan
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studyModules.slice(0, 4).map((module) => (
                    <ModuleCard
                      key={module.id}
                      id={module.id}
                      title={module.title}
                      description={module.description}
                      completed={module.completed}
                      total={module.total}
                      difficulty={module.difficulty}
                      estimatedTime={module.estimatedTime}
                      topics={module.topics}
                      icon={module.icon}
                      onClick={handleModuleClick}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-6">
              <ProgressCircle
                value={68}
                size={180}
                strokeWidth={12}
                valueClassName="text-2xl"
              />
              <div className="mt-8 w-full space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Quantitative</span>
                    <span>72%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-600 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Verbal</span>
                    <span>65%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-purple-600 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Integrated Reasoning</span>
                    <span>58%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-600 rounded-full" style={{ width: '58%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PerformanceChart data={performanceData} />
          <TopicHeatMap data={topicPerformance} />
        </div>
        
        {/* AI Tutor */}
        <DashboardAIChat />
      </div>
    </AITutorProvider>
  );
};

// Separate component for AI Chat
const DashboardAIChat: React.FC = () => {
  const { messages, sendMessage, isTyping } = useAITutor();
  
  return (
    <Card className="relative overflow-hidden border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardTitle>Ask Your AI Tutor</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BarChart2 size={36} className="mx-auto mb-4 text-gray-400" />
              <p className="font-medium">No messages yet</p>
              <p className="text-sm mt-1">Ask anything about GMAT preparation, your performance, or specific questions.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                />
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <TypingIndicator />
                </div>
              )}
            </div>
          )}
        </div>
        
        <ChatInput
          onSendMessage={sendMessage}
          isTyping={isTyping}
          placeholder="Ask about your progress, study plan, or GMAT concepts..."
        />
      </CardContent>
    </Card>
  );
};

export default Dashboard;
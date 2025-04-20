import React from 'react';
import { Outlet } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex">
      {/* Left Panel: Branding */}
      <div className="hidden lg:flex flex-col w-1/2 p-12 justify-center items-center bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-md">
          <div className="flex items-center mb-8">
            <BookOpen size={40} />
            <h1 className="text-4xl font-bold ml-3">OpenPrep</h1>
          </div>
          
          <h2 className="text-3xl font-bold mb-6">Your AI-powered GMAT tutor</h2>
          
          <div className="space-y-6 text-lg">
            <p>
              OpenPrep uses advanced AI to provide personalized GMAT tutoring that adapts to your learning style, strengths, and weaknesses.
            </p>
            <p>
              Our platform analyzes your performance in real-time to create a customized study plan that maximizes your score improvement in the shortest time possible.
            </p>
            <p>
              Join thousands of students who have achieved their target GMAT scores with OpenPrep.
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-bold text-xl">24/7</h3>
              <p className="text-white/80 text-sm">Always available tutoring</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-bold text-xl">+68</h3>
              <p className="text-white/80 text-sm">Average score improvement</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-bold text-xl">92%</h3>
              <p className="text-white/80 text-sm">Meet target score</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel: Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center mb-8">
            <BookOpen size={30} className="text-blue-600" />
            <h1 className="text-2xl font-bold ml-2 text-gray-900">OpenPrep</h1>
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
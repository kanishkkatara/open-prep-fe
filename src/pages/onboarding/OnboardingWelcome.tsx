import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, MessageCircle } from 'lucide-react';
import Button from '../../components/ui/Button';

const OnboardingWelcome: React.FC = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    // Simulate loading animation
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleContinue = () => {
    navigate('/onboarding/chat');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl max-w-3xl w-full overflow-hidden"
      >
        <div className="bg-blue-600 text-white p-8 flex items-center">
          <BookOpen size={32} className="mr-4" />
          <div>
            <h1 className="text-2xl font-bold">Welcome to OpenPrep</h1>
            <p className="opacity-80">Your personalized GMAT preparation journey begins now</p>
          </div>
        </div>
        
        {!showContent ? (
          <div className="p-8 flex justify-center items-center" style={{ height: '300px' }}>
            <div className="flex space-x-2">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    repeatDelay: 0.2,
                    delay: index * 0.2,
                  }}
                  className="w-4 h-4 rounded-full bg-blue-600"
                />
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-8"
          >
            <div className="mb-8 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <MessageCircle size={40} className="text-blue-600" />
              </motion.div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Hi there! I'm your OpenPrep AI Assistant
              </h2>
              <p className="text-gray-600 max-w-lg mx-auto">
                I'm here to personalize your GMAT preparation journey. I'll be your personal GMAT tutor, 
                available 24/7 to answer questions, explain concepts, and keep you on track.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-8">
              <h3 className="font-medium text-blue-800 mb-2">How I can help you:</h3>
              <ul className="space-y-2 text-blue-700">
                <li className="flex items-start">
                  <span className="h-5 w-5 rounded-full bg-blue-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                  </span>
                  Create a personalized study plan based on your schedule and learning style
                </li>
                <li className="flex items-start">
                  <span className="h-5 w-5 rounded-full bg-blue-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                  </span>
                  Provide hints and explanations when you're working through problems
                </li>
                <li className="flex items-start">
                  <span className="h-5 w-5 rounded-full bg-blue-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                  </span>
                  Remember your strengths and weaknesses to focus practice sessions
                </li>
                <li className="flex items-start">
                  <span className="h-5 w-5 rounded-full bg-blue-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                  </span>
                  Explain concepts in different ways until you find what clicks for you
                </li>
              </ul>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Before we begin, I'd like to get to know you better so I can customize your GMAT preparation experience.
                Let's have a quick conversation about your goals and preferences.
              </p>
              
              <Button
                size="lg"
                className="px-8"
                rightIcon={<MessageCircle size={18} />}
                onClick={handleContinue}
              >
                Start Conversation
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default OnboardingWelcome;
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import ChatMessage from '../../components/chat/ChatMessage';
import ChatInput from '../../components/chat/ChatInput';
import TypingIndicator from '../../components/chat/TypingIndicator';
import Button from '../../components/ui/Button';
import { onboardingMessages } from '../../data/mockData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isNew?: boolean;
}

const OnboardingChat: React.FC = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useUser();
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<string>('background');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showCompletionCard, setShowCompletionCard] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    // Simulate initial messages loading
    const loadInitialMessages = async () => {
      for (let i = 0; i < onboardingMessages.length; i++) {
        if (i >= 3) setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsTyping(false);
        
        setMessages(prev => [
          ...prev, 
          { ...onboardingMessages[i], isNew: true }
        ]);
        
        setProgress(Math.min(100, Math.round((i / 12) * 100)));
      }
    };
    
    loadInitialMessages();
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  
  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      isNew: true,
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI typing
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Display next question based on current stage
    let responseContent = '';
    
    switch (currentStage) {
      case 'background':
        responseContent = "Thank you for sharing! Can you tell me about your mathematical background and comfort level? This helps me understand which areas might need more focus.";
        setCurrentStage('math_background');
        break;
      case 'math_background':
        responseContent = "Great! Now, what's your target score and when are you planning to take the GMAT?";
        setCurrentStage('target_score');
        break;
      case 'target_score':
        responseContent = "Do you have any specific learning preferences? For example, do you prefer visual explanations, step-by-step walkthroughs, or concept discussions?";
        setCurrentStage('learning_style');
        break;
      case 'learning_style':
        responseContent = "Excellent! Based on our conversation, I understand you're targeting a higher score with particular focus needed on improving your quantitative skills. I've created an initial study plan for you that we can adjust anytime.";
        setCurrentStage('completion');
        break;
      case 'completion':
        responseContent = "Thanks for sharing all this information! I now have everything I need to personalize your GMAT preparation experience. Would you like to start exploring the platform?";
        setShowCompletionCard(true);
        break;
    }
    
    setProgress(Math.min(100, progress + 20));
    
    setIsTyping(false);
    
    // Add assistant response
    if (responseContent) {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        isNew: true,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }
  };
  
  const handleComplete = () => {
    completeOnboarding();
    navigate('/app/dashboard');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Getting to know you</h1>
          <p className="text-sm text-gray-600">
            Share some information to personalize your experience
          </p>
        </div>
        <div className="w-48">
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-600 mt-1 text-right">{progress}% complete</div>
        </div>
      </div>
      
      {/* Chat Container */}
      <div className="flex-1 bg-white max-w-3xl w-full mx-auto my-8 rounded-lg shadow-md flex flex-col overflow-hidden">
        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                isNew={message.isNew}
              />
            ))}
            
            {isTyping && (
              <div className="flex justify-start mb-4">
                <TypingIndicator />
              </div>
            )}
            
            {showCompletionCard && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mt-6"
              >
                <h3 className="text-xl font-semibold mb-3">Profile Complete!</h3>
                <p className="mb-4">
                  You've successfully completed your GMAT preparation profile. I'll use this information to 
                  create a personalized learning experience for you.
                </p>
                <Button
                  onClick={handleComplete}
                  className="bg-white text-blue-700 hover:bg-blue-50"
                  rightIcon={<ArrowRight size={16} />}
                >
                  Go to Dashboard
                </Button>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Chat Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
          disabled={showCompletionCard}
          placeholder={showCompletionCard ? "Conversation complete. Click 'Go to Dashboard' to continue." : "Type your response..."}
        />
      </div>
    </div>
  );
};

export default OnboardingChat;
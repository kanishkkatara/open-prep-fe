import React, { createContext, useState, useContext, useCallback } from 'react';
import { delay, generateId } from '../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AITutorContextType {
  messages: Message[];
  isTyping: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

const AITutorContext = createContext<AITutorContextType>({
  messages: [],
  isTyping: false,
  sendMessage: async () => {},
  clearMessages: () => {},
});

export const AITutorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Mock responses for different types of messages
  const getMockResponse = (userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes('gmat') && lowerMsg.includes('score')) {
      return "Based on your profile and practice performance, you're on track for a score range of 680-720. To push towards the higher end, I'd recommend focusing more on Data Sufficiency questions, where your accuracy is currently at 68%.";
    }
    
    if (lowerMsg.includes('problem') || lowerMsg.includes('question') || lowerMsg.includes('stuck')) {
      return "Let's break this down step by step. First, identify what the question is asking for. Then, look at what information you have. For this type of problem, consider whether you need to solve for the exact value or if you can work with the constraints to eliminate answer choices.";
    }
    
    if (lowerMsg.includes('study') || lowerMsg.includes('plan')) {
      return "I've adjusted your study plan based on your recent performance. I've added more practice on Critical Reasoning since you've been making good progress there, and increased focus on Quantitative Problem Solving where you need more practice. Would you like to see the updated schedule?";
    }
    
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
      return "Hello! I'm your OpenPrep AI Assistant. How can I help with your GMAT preparation today?";
    }
    
    return "I understand you're asking about " + userMessage.substring(0, 20) + "... To best help you, could you share a bit more context or specify what aspect you'd like me to address?";
  };

  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI thinking/typing
    setIsTyping(true);
    await delay(1500 + Math.random() * 1500); // Random delay between 1.5-3s
    
    // Add AI response
    const aiResponse: Message = {
      id: generateId(),
      role: 'assistant',
      content: getMockResponse(content),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <AITutorContext.Provider
      value={{
        messages,
        isTyping,
        sendMessage,
        clearMessages,
      }}
    >
      {children}
    </AITutorContext.Provider>
  );
};

export const useAITutor = () => useContext(AITutorContext);
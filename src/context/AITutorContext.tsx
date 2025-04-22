// src/context/AITutorContext.tsx

import React, { createContext, useState, useContext, useCallback } from 'react';
import { generateId } from '../lib/utils';
import { sendChatMessage } from '../lib/api';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AITutorContextType {
  messages: Message[];
  isTyping: boolean;
  /**
   * Send a message to the tutor.
   * @param content  The user's text.
   * @param question Optional: the full question text for context.
   */
  sendMessage: (content: string, question?: Object) => Promise<void>;
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

  const sendMessage = useCallback(
    async (content: string, question?: Object) => {
      // 1️⃣ Add the user's message locally
      const userMsg: Message = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);

      try {
        const userId = localStorage.getItem('userId') || '1';

        // 2️⃣ Call your API, passing question_text in the `context` object
        const response = await sendChatMessage({
          userId,
          message: content,
          chatType: 'tutoring',
          context: question ? { question_text: question } : undefined,
        });

        // 3️⃣ Append the assistant's reply
        const assistantMsg: Message = {
          id: generateId(),
          role: 'assistant',
          content: response.reply || "Sorry, I didn't catch that. Could you rephrase?",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMsg]);
      } catch (err) {
        console.error('Tutor error:', err);
        setMessages(prev => [
          ...prev,
          {
            id: generateId(),
            role: 'assistant',
            content: 'Oops! There was an error. Please try again.',
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    []
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <AITutorContext.Provider value={{ messages, isTyping, sendMessage, clearMessages }}>
      {children}
    </AITutorContext.Provider>
  );
};

export const useAITutor = () => useContext(AITutorContext);

// src/components/chat/ChatInput.tsx
import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isTyping: boolean;
  placeholder?: string;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isTyping, 
  placeholder = 'Type your message...',
  disabled = false
}) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !isTyping) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">      
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || isTyping}
          className="flex-1 border border-gray-300 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled || isTyping}
          className={`p-2 rounded-r-md ${
            !message.trim() || disabled || isTyping
              ? 'bg-gray-300 cursor-not-allowed'
              : ' bg-gradient-to-l from-blue-500 to-purple-500'
          }`}
        >
          <Send size={20} className="text-white" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;

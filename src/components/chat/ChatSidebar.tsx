// src/components/chat/ChatSidebar.tsx
import React from 'react'
import { HelpCircle } from 'lucide-react'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import TypingIndicator from './TypingIndicator'
import { useAITutor } from '../../context/AITutorContext'

const ChatSidebar: React.FC = () => {
  const { messages, isTyping, sendMessage } = useAITutor()

  // Wrapper to match ChatInput’s API
  const handleSend = (text: string) => {
    sendMessage(text)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-gray-50 p-3 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">AI Tutor Assistant</h3>
        <p className="text-sm text-gray-600">
          Ask for hints or explanations
        </p>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <HelpCircle
              size={36}
              className="mx-auto mb-4 text-gray-400"
            />
            <p className="font-medium">Need help?</p>
            <p className="text-sm mt-1">
              Ask your AI tutor for hints or explanations without revealing the answer.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(m => (
              <ChatMessage
                key={m.id}
                role={m.role}
                content={m.content}
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

      {/* Input */}
      <div className="border-t border-gray-200">
        <ChatInput
          onSendMessage={handleSend}
          isTyping={isTyping}
          placeholder="Ask for a hint or explanation..."
        />
      </div>
    </div>
  )
}

export default ChatSidebar

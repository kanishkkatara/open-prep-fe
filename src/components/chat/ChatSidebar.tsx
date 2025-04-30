// src/components/chat/ChatSidebar.tsx
import React, { useRef, useEffect } from 'react'
import { HelpCircle } from 'lucide-react'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import TypingIndicator from './TypingIndicator'
import { useAITutor } from '../../context/AITutorContext'

const ChatSidebar: React.FC = () => {
  const { messages, isTyping, sendMessage } = useAITutor()
  const listRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  // Wrapper to match ChatInput’s API
  const handleSend = (text: string) => {
    sendMessage(text)
  }

  // Auto-scroll to bottom on new messages or typing indicator
  useEffect(() => {
    // Scroll the container to the bottom element
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping])

  return (
    <div className="flex flex-col h-full bg-white">

      {/* Message List */}
      <div ref={listRef} className="flex-1 overflow-y-auto p-4 min-h-0">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <HelpCircle
              size={36}
              className="mx-auto mb-4 text-gray-400"
            />
            <p className="font-medium">Need help?</p>
            <p className="text-sm mt-2">
              Ask Clara to:
            </p>
            <ul className="text-sm text-gray-500 list-disc list-inside space-y-1 mt-2">
              <li>Break down problems step-by-step</li>
              <li>Request targeted hints without giving away answers</li>
              <li>Clarify key concepts and formulas</li>
              <li>Get strategy and study tips</li>
              <li>Generate extra practice questions</li>
            </ul>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(m => (
              <ChatMessage
                key={m.id}
                role={m.role}
                content={m.content}
                isNew={false}
              />
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <TypingIndicator />
              </div>
            )}
            {/* Dummy div to scroll into view */}
            <div ref={endRef} />
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
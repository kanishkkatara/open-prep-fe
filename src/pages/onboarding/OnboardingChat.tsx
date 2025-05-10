import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useUser } from "../../context/UserContext";
import ChatMessage from "../../components/chat/ChatMessage";
import ChatInput from "../../components/chat/ChatInput";
import TypingIndicator from "../../components/chat/TypingIndicator";
import Button from "../../components/ui/Button";
import { sendChatMessage } from "../../lib/api";
import toast from "react-hot-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isNew?: boolean;
}

const OnboardingChat: React.FC = () => {
  const navigate = useNavigate();
  const { completeOnboarding, user } = useUser();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showCompletionCard, setShowCompletionCard] = useState(false);
  const [hasInit, setHasInit] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (!hasInit && user?.id && messages.length === 0) {
      handleSendMessage("__init__");
      setHasInit(true);
    }
  }, [user, hasInit, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (content: string) => {
    if (!user?.id) return;

    // Only show user message if it's not init
    if (content !== "__init__") {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "user",
          content,
          isNew: true,
        },
      ]);
    }

    setIsTyping(true);

    try {
      const res = await sendChatMessage({
        userId: user.id.toString(),
        message: content,
        chatType: "onboarding",
      });

      if (res.reply) {
        // Avoid duplicate assistant messages (same text)
        setMessages((prev) => {
          const alreadyShown = prev.some(
            (m) => m.role === "assistant" && m.content === res.reply
          );
          if (alreadyShown) return prev;

          return [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content: res.reply,
              isNew: true,
            },
          ];
        });
      }
      if (res.onboarding_complete) {
        setShowCompletionCard(true);
        setProgress(100);
      } else {
        setProgress((prev) => Math.min(prev + 20, 95));
      }
    } catch (err) {
      console.error("Chat API failed", err);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, something went wrong!",
          isNew: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleComplete = async () => {
    try {
      await completeOnboarding();
      navigate("/app/dashboard");
    } catch (err) {
      console.error("Could not complete onboarding:", err);
      toast.error("Oops! Could not complete onboarding. Please try again.");
    }
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
            />
          </div>
          <div className="text-xs text-gray-600 mt-1 text-right">{progress}% complete</div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white max-w-3xl w-full mx-auto my-8 rounded-lg shadow-md flex flex-col overflow-hidden">
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
                  You've successfully completed your GMAT preparation profile. I'll use this
                  information to create a personalized learning experience for you.
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
          placeholder={
            showCompletionCard
              ? "Conversation complete. Click 'Go to Dashboard' to continue."
              : "Type your response..."
          }
        />
      </div>
    </div>
  );
};

export default OnboardingChat;

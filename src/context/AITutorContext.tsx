import React, { createContext, useState, useContext, useCallback } from "react";
import { generateId } from "../lib/utils";
import { sendChatMessage } from "../lib/api";
import { useUser } from "./UserContext";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AITutorContextType {
  messages: Message[];
  isTyping: boolean;
  /**
   * Send a message to the tutor.
   * @param content  The user's text.
   * @param overrideContext Optional: override the stored screen context.
   */
  sendMessage: (content: string, overrideContext?: object) => Promise<void>;
  clearMessages: () => void;

  // screen context for current screen (e.g., question text + options)
  screenContext: object | undefined;
  /**
   * Set or update the screen context used in subsequent sendMessage calls
   */
  setScreenContext: (ctx: object) => void;
}

const AITutorContext = createContext<AITutorContextType>({
  messages: [],
  isTyping: false,
  sendMessage: async () => {},
  clearMessages: () => {},
  screenContext: undefined,
  setScreenContext: () => {},
});

export const AITutorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [screenContext, setScreenContext] = useState<object | undefined>(
    undefined
  );

  const sendMessage = useCallback(
    async (content: string, overrideContext?: object) => {
      // 1️⃣ Add the user's message locally
      const userMsg: Message = {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      try {
        if (!user) {
          console.error("Cannot send message – no user in context");
          return;
        }
        const userId = user.id.toString();
        // Determine which context to send: override or stored
        const ctx = overrideContext ?? screenContext;
        const apiContext = ctx ? { question_text: ctx } : undefined;

        // 2️⃣ Call your API, passing context
        const response = await sendChatMessage({
          userId,
          message: content,
          chatType: "tutoring",
          context: apiContext,
        });

        // 3️⃣ Append the assistant's reply
        const assistantMsg: Message = {
          id: generateId(),
          role: "assistant",
          content:
            response.reply || "Sorry, I didn't catch that. Could you rephrase?",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        console.error("Tutor error:", err);
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "assistant",
            content: "Oops! There was an error. Please try again.",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [screenContext, user]
  );

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
        screenContext,
        setScreenContext,
      }}
    >
      {children}
    </AITutorContext.Provider>
  );
};

export const useAITutor = () => useContext(AITutorContext);

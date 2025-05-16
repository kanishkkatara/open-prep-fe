import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useUser } from "../../context/UserContext";
import ChatMessage from "../../components/chat/ChatMessage";
import ChatInput from "../../components/chat/ChatInput";
import TypingIndicator from "../../components/chat/TypingIndicator";
import Button from "../../components/ui/Button";
import { sendChatMessage, getBasicSettings, updateBasicSettings } from "../../lib/api";
import toast from "react-hot-toast";
import type { BasicSettings } from "../../lib/types";

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

  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [targetScore, setTargetScore] = useState<number | null>(null);
  const [examDate, setExamDate] = useState<string | null>(null);
  const [previousScore, setPreviousScore] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (!user?.id) return;

    getBasicSettings()
      .then(data => {
        setName(data.name ?? null);
        setEmail(data.email ?? null);
        setCountry(data.country ?? null);
        setTargetScore(data.target_score ?? null);
        setExamDate(data.exam_date ?? null);
        setPreviousScore(data.previous_score ?? null);
      })
      .catch((err) => {
        console.error("Error fetching basic settings:", err);
        toast.error("Failed to load basic settings.");
      });
  }, [user?.id]);

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

    if (content !== "__init__") {
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "user", content, isNew: true }]);
    }

    setIsTyping(true);
    try {
      const profile: Partial<BasicSettings> = {};
      if (name) profile.name = name;
      if (email) profile.email = email;
      if (country) profile.country = country;
      if (targetScore !== null) profile.target_score = targetScore;
      if (examDate) profile.exam_date = examDate;
      if (previousScore !== null) profile.previous_score = previousScore;

      const res = await sendChatMessage({
        userId: user.id.toString(),
        message: content,
        chatType: "onboarding",
        context: { profile },
      });

      if (res.profile) {
        if (res.profile.name !== undefined) setName(res.profile.name);
        if (res.profile.email !== undefined) setEmail(res.profile.email);
        if (res.profile.country !== undefined) setCountry(res.profile.country);
        if (res.profile.target_score !== undefined) setTargetScore(res.profile.target_score);
        if (res.profile.exam_date !== undefined) setExamDate(res.profile.exam_date);
        if (res.profile.previous_score !== undefined) setPreviousScore(res.profile.previous_score);
      }

      if (res.reply) {
        setMessages(prev => {
          if (prev.some(m => m.role === "assistant" && m.content === res.reply)) return prev;
          return [...prev, { id: crypto.randomUUID(), role: "assistant", content: res.reply, isNew: true }];
        });
      }
      if (isProfileComplete()) {
        setShowCompletionCard(true);
        setProgress(100);
      } else {
        setProgress(prev => Math.min(prev + 20, 95));
      }
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("An error occurred while sending the message.");
      setMessages(prev => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: "Sorry, something went wrong!", isNew: true },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const isProfileComplete = (): boolean => {
    return !!(name && email && country && targetScore && examDate);
  };

  const validateProfile = (): boolean => {
    if (!name || !email || !country || !targetScore || !examDate) {
      toast.error("Please fill out all required fields.");
      return false;
    }
    if (targetScore < 200 || targetScore > 800) {
      toast.error("GMAT target score should be between 200 and 800.");
      return false;
    }
    const today = new Date();
    const selectedDate = new Date(examDate);
    if (selectedDate.getFullYear() > 2030 || selectedDate < today) {
      toast.error("Please select a valid exam date up to 2030.");
      return false;
    }
    return true;
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    if (!validateProfile()) return;

    const updated: Partial<BasicSettings> = {};
    if (name) updated.name = name;
    if (email) updated.email = email;
    if (country) updated.country = country;
    if (targetScore !== null) updated.target_score = targetScore;
    if (examDate) updated.exam_date = examDate;
    if (previousScore !== null) updated.previous_score = previousScore;
    if (!name || !email || !country || !targetScore || !examDate) {
      updated.onboarding_completed = false;
    }

    try {
      await updateBasicSettings(updated as BasicSettings);
      toast.success("Profile saved");

      if (isProfileComplete()) {
        setShowCompletionCard(true);
        setProgress(100);
      } else {
        setProgress(prev => Math.min(prev + 20, 95));
      }
    } catch (err) {
      console.error("Profile save failed", err);
      toast.error("Could not save profile");
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
    <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex">
      {/* Left: Form Section */}
      <div className="w-8/12 h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-auto flex flex-col">
        {/* Getting to know you Block */}
        <div className="w-full bg-white shadow p-5 flex items-center justify-between border-b border-gray-200 sticky top-0">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Getting to know you</h1>
            <p className="text-sm text-gray-600">Share some information to personalize your experience</p>
          </div>
          <div className="w-52">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-600 mt-1 text-right">{progress}% complete</div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-6 flex-1 overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Quick Profile</h2>
          <form className="space-y-5" onSubmit={e => { e.preventDefault(); handleSaveProfile(); }}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={name ?? ""}
                onChange={e => setName(e.target.value || null)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                value={email ?? ""}
                disabled
                className="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 shadow-sm sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                value={country ?? ""}
                onChange={e => setCountry(e.target.value || null)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GMAT Target score</label>
            <input
                type="number"
                value={targetScore ?? ""}
                onChange={e => setTargetScore(parseInt(e.target.value) || null)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Date</label>
              <input
                type="date"
                value={examDate ?? ""}
                onChange={e => setExamDate(e.target.value || null)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Previous GMAT Score (if any)</label>
              <input
                type="number"
                value={previousScore ?? ""}
                onChange={e => setPreviousScore(parseInt(e.target.value) || null)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-end mt-6">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>

        {/* Completion Card */}

        {showCompletionCard && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mt-6"
            >
              <h3 className="text-xl font-semibold mb-3">Profile Complete!</h3>
              <p className="mb-4">
                You've successfully completed your GMAT preparation profile. I'll use this information to create a personalized learning experience for you.
              </p>
              <Button
                onClick={handleComplete}
                className="bg-white text-blue-700 hover:bg-gray-100 font-semibold flex items-center gap-2"
              >
                Go to Dashboard <ArrowRight size={16} />
              </Button>
            </motion.div>
          )}
      </div>

      {/* Right: Chat Section */}
      <div className="w-4/12 h-full bg-white rounded-r-xl shadow-sm border border-gray-100 flex flex-col relative">
        {/* Chat Header */}
        <div className="w-full bg-white shadow p-4 flex items-center justify-between border-b border-gray-200 sticky top-0">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Clara AI</h1>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} content={message.content} role={message.role} isNew={message.isNew} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
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

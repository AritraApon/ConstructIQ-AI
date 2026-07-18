"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { postMutation } from "@/lib/core/server";
import { authClient } from "@/lib/auth-client";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function ConstructIQChatbot() {
  const { data: session } = authClient.useSession();
  const name = session?.user?.name || "there";

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: `Hello! I am your ConstructIQ Assistant. Ask me anything about civil engineering estimations, project planning, or cost calculations!`,
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    setInputValue("");

    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      text: userText,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const result = await postMutation<{ success: boolean; reply: string }, { message: string }>("/api/ai/chat", {
        message: userText,
      });

      if (!result) throw new Error("No response received from server");
      if ("error" in result) throw new Error((result as any).message || "Failed to get AI response");

      if (result.success && result.reply) {
        const botMsg: Message = {
          id: Math.random().toString(36).substring(7),
          text: result.reply,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error("Invalid reply structure from server");
      }
    } catch (error: any) {
      console.error("Chatbot communication error:", error);
      const errorMsg: Message = {
        id: Math.random().toString(36).substring(7),
        text: "I'm sorry, I encountered an error communicating with the estimation AI. Please try again shortly.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button - একদম ফিক্সড পজিশন ফোর্স করা হয়েছে */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: "fixed", zIndex: 9999 }}
        className="bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#10B981] to-[#38BDF8] text-[#020617] shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-transform duration-300 hover:scale-110 active:scale-95 focus:outline-none cursor-pointer"
        aria-label="Toggle chat"
      >
        <span className="absolute -inset-1 animate-ping rounded-full bg-gradient-to-tr from-[#10B981]/40 to-[#38BDF8]/40 opacity-75 blur-sm" />
        {isOpen ? (
          <svg className="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat Window Panel - ওপরে ওঠার জন্য ফিক্সড পজিশন */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ position: "fixed", zIndex: 9998 }}
            className="bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0F172A] border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981]/60 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]"></span>
                </span>
                <span className="font-semibold text-sm text-[#F8FAFC] tracking-wide">ConstructIQ Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition cursor-pointer" aria-label="Close chat">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#0F172A] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-4`}>
                  {message.sender === "bot" ? (
                    <div className="flex items-start space-x-2 max-w-[85%]">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8]">
                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="bg-[#020617] text-[#F8FAFC] px-4 py-2.5 rounded-2xl rounded-tl-none border border-slate-900 text-sm leading-relaxed shadow-sm">
                        {message.text}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-tr from-[#10B981] to-[#059669] text-[#020617] px-4 py-2.5 rounded-2xl rounded-tr-none text-sm font-semibold leading-relaxed max-w-[85%] shadow-md">
                      {message.text}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="flex items-start space-x-2 max-w-[85%]">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8]">
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="bg-[#020617] px-4 py-3 rounded-2xl rounded-tl-none border border-slate-900 flex items-center space-x-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 bg-[#020617] border-t border-slate-800 flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about materials, budget..."
                className="flex-grow bg-[#0F172A] border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:border-[#38BDF8]/60 transition"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-xl bg-[#10B981] text-[#020617] hover:bg-[#10B981]/90 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                aria-label="Send message"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
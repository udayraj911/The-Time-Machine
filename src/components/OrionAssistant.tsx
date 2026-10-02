import React, { useState, useRef, useEffect } from "react";
import { OrionChatMessage } from "../types";
import { askTempus } from "../services/apiService";
import { audio } from "../services/audioService";
import {
  Bot,
  Send,
  X,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  Compass,
  CornerDownLeft,
  Loader2,
  MessageSquare,
  HelpCircle,
} from "lucide-react";

interface OrionAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  currentYear: number;
  activeMode: string;
  onJumpToYear: (year: number) => void;
  initialQuery?: string;
}

export const OrionAssistant: React.FC<OrionAssistantProps> = ({
  isOpen,
  onClose,
  currentYear,
  activeMode,
  onJumpToYear,
  initialQuery,
}) => {
  const [messages, setMessages] = useState<OrionChatMessage[]>([
    {
      id: "initial-msg",
      role: "assistant",
      content: `Greetings, Traveler. I am TEMPUS (Temporal Exploration, Mapping, & Processing Universal System), your temporal intelligence guide.\n\nWe are currently synchronized with Year ${
        currentYear < 0 ? `${Math.abs(currentYear)} BCE` : `${currentYear} CE`
      }. You may query historical occurrences, speculative future trajectories, or command a temporal warp to any coordinate.`,
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    `What was happening in India in 1947?`,
    `What technology existed in 1980?`,
    `Show me the most important scientific discoveries of 1905.`,
    `Take me to the most important moments of the 20th century.`,
    `What might the world look like in 2100?`,
  ];

  // If external initialQuery provided, fire it
  useEffect(() => {
    if (initialQuery && isOpen) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery, isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    audio.playClick(900);
    const userMsg: OrionChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await askTempus(textToSend, currentYear, activeMode, messages);

      const aiMsg: OrionChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: response.reply,
        timestamp: Date.now(),
        suggestedJumpYear: response.suggestedJumpYear || undefined,
        location: response.location || undefined,
        eraTitle: response.eraTitle || undefined,
      };

      audio.playHoloBeep();
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: "assistant",
          content:
            "Temporal transmission interrupted by cosmic interference. Please re-verify coordinates and retry.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (msgId: string, text: string) => {
    if (!("speechSynthesis" in window)) return;

    if (isSpeakingId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;
    utterance.onend = () => setIsSpeakingId(null);
    utterance.onerror = () => setIsSpeakingId(null);

    setIsSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  if (!isOpen) return null;

  return (
    <div
      id="orion-assistant-drawer"
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-950/95 border-l border-purple-500/30 backdrop-blur-2xl text-white flex flex-col shadow-[-10px_0_40px_rgba(0,0,0,0.8)] select-none"
    >
      {/* Drawer Header */}
      <div className="p-4 border-b border-purple-500/20 flex items-center justify-between bg-purple-950/20">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-400/50 flex items-center justify-center">
            <Bot className="w-5 h-5 text-purple-300 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm tracking-wider text-white">
                TEMPUS AI GUIDE
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-900/60 text-purple-200 font-mono border border-purple-500/30">
                GEMINI 3.7
              </span>
            </div>
            <p className="text-[11px] font-mono text-purple-300/70">
              TEMPORAL RESONANCE // ACTIVE
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            audio.playClick();
            if ("speechSynthesis" in window) window.speechSynthesis.cancel();
            onClose();
          }}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-purple-500/20">
        {messages.map((msg) => {
          const isAi = msg.role === "assistant";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAi ? "items-start" : "items-end"} space-y-1.5`}
            >
              <div
                className={`max-w-[92%] p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                  isAi
                    ? "bg-slate-900/90 border border-purple-500/30 text-slate-200 rounded-tl-sm shadow-[0_0_20px_rgba(168,85,247,0.1)]"
                    : "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-tr-sm font-sans"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* AI Interactive Jump Button if Year suggested */}
                {isAi && msg.suggestedJumpYear && (
                  <div className="mt-3 pt-3 border-t border-purple-500/20 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-purple-300">
                      IDENTIFIED YEAR: {msg.suggestedJumpYear < 0 ? `${Math.abs(msg.suggestedJumpYear)} BCE` : `${msg.suggestedJumpYear} CE`}
                    </span>
                    <button
                      onClick={() => {
                        audio.playClick(1100);
                        onJumpToYear(msg.suggestedJumpYear!);
                      }}
                      className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-black" />
                      <span>WARP TO YEAR</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Message Meta & Audio Toggle */}
              {isAi && "speechSynthesis" in window && (
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 px-1">
                  <button
                    onClick={() => handleSpeak(msg.id, msg.content)}
                    className="hover:text-purple-300 transition flex items-center gap-1 cursor-pointer"
                  >
                    {isSpeakingId === msg.id ? (
                      <VolumeX className="w-3 h-3 text-purple-400" />
                    ) : (
                      <Volume2 className="w-3 h-3 text-purple-400" />
                    )}
                    <span>{isSpeakingId === msg.id ? "Stop voice" : "Listen voice"}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-purple-500/20 text-xs font-mono text-purple-300 animate-pulse max-w-[80%]">
            <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
            <span>TEMPUS IS SCANNING TEMPORAL ARCHIVES...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 border-t border-purple-500/10 bg-slate-950/60 overflow-x-auto scrollbar-none flex items-center gap-2">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-500/40 text-[11px] font-mono text-slate-300 hover:text-purple-200 transition whitespace-nowrap cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputText);
        }}
        className="p-3 border-t border-purple-500/20 bg-slate-950 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask TEMPUS about any moment in time..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLoading}
          className="flex-1 bg-slate-900/80 border border-slate-700 focus:border-purple-400 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none font-sans"
        />
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 text-white transition cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

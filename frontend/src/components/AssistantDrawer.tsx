import { useEffect, useRef, useState } from "react";
import {
  Bot,
  ChevronDown,
  ChevronUp,
  SendHorizontal,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/useAppStore";
import { closeAssistant } from "../store/slices/uiSlice";
import api from "../api/axios";

interface Message {
  role: "user" | "assistant";
  text: string;
  error?: boolean;
}

const SUGGESTIONS = [
  "What events do I have coming up?",
  "Do I have any events this month?",
  "Which of my events have the most participants?",
  "Summarize my organized events.",
];

export default function AssistantDrawer() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((s) => s.ui.assistantOpen);

  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const close = () => dispatch(closeAssistant());

  const ask = async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await api.post<{ answer: string }>("/ai/ask", {
        question: trimmed,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: res.data.answer },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            err.response?.data?.message || "Something went wrong. Try again.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-[440px] max-w-[92vw] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Bot size={16} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">AI Assistant</p>
              <p className="text-xs text-gray-400">
                Powered by Groq · Llama 3.3
              </p>
            </div>
          </div>
          <button
            onClick={close}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Close assistant"
          >
            <X size={18} />
          </button>
        </div>

        {/* Popular questions (collapsible, always present) */}
        <div className="border-b border-gray-100 shrink-0">
          <button
            onClick={() => setSuggestionsOpen((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hover:bg-gray-50 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles size={11} />
              Popular questions
            </span>
            {suggestionsOpen ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
          </button>
          {suggestionsOpen && (
            <div className="px-5 pb-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  disabled={loading}
                  className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-colors disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.length === 0 && !loading && (
            <p className="text-sm text-gray-400 text-center mt-8">
              Ask me anything about your events.
            </p>
          )}

          {messages.map((msg, i) =>
            msg.role === "user" ? (
              <div key={i} className="flex justify-end gap-2">
                <div className="max-w-[80%] bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm">
                  {msg.text}
                </div>
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                  <User size={12} className="text-indigo-600" />
                </div>
              </div>
            ) : (
              <div key={i} className="flex justify-start gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot size={12} className="text-gray-500" />
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.error
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ),
          )}

          {loading && (
            <div className="flex justify-start gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <Bot size={12} className="text-gray-500" />
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-5 py-4 border-t border-gray-100 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(question);
            }}
            className="flex gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about your events..."
              maxLength={500}
              disabled={loading}
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-colors"
            >
              <SendHorizontal size={16} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

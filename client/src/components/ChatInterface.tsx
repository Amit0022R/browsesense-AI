import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

interface ChatInterfaceProps {
  historyData: any[];
}

const SUGGESTIONS = [
  "Where did I waste most time?",
  "How to improve focus?",
  "What should I reduce?",
  "Give me tips to reduce distractions"
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ historyData }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: "Hello! I've analyzed your browsing history. Ask me anything about your habits or how to improve your focus!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 1 || isTyping) {
      scrollToBottom();
    }
  }, [messages, isTyping]);

  const handleSend = async (question: string) => {
    if (!question.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: question };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await axios.post(`${API_URL}/chat`, {
        question,
        history: historyData
      });
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: res.data.response
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "Sorry, I ran into an error processing your question. Please try again."
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm rounded-2xl flex flex-col mt-8 overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center gap-2 bg-slate-50/50">
        <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
        <h3 className="text-[15px] font-medium text-[var(--color-text-primary)]">Chat with your History</h3>
      </div>
      <div className="flex-1 p-6 overflow-y-auto max-h-[400px] flex flex-col gap-6 bg-slate-50/30">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
            <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`px-4 py-3 rounded-2xl text-[14px] leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-[var(--color-accent)] text-white rounded-tr-sm' 
                : 'bg-white border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-tl-sm shadow-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3 self-start max-w-[85%] animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 shrink-0 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="px-4 py-3.5 rounded-2xl rounded-tl-sm bg-white border border-[var(--color-border)] shadow-sm flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t border-[var(--color-border)]">
        {messages.length < 3 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {SUGGESTIONS.map((sug, idx) => (
              <button 
                key={idx}
                onClick={() => handleSend(sug)}
                className="text-[12px] font-medium px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors border border-indigo-100"
              >
                {sug}
              </button>
            ))}
          </div>
        )}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="flex items-center gap-2 relative"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your browsing habits..."
            className="flex-1 bg-slate-50 border border-[var(--color-border)] rounded-full pl-5 pr-12 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            <Send className="w-4 h-4 -ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

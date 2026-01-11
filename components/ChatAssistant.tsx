
import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, Bot, User, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { chatWithAssistant } from '../services/gemini';
// Changed Organization to Project
import { Project } from '../types';

interface ChatAssistantProps {
  // Changed Organization to Project
  org: Project;
  projects: Project[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ org, projects }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hello! I'm your Iterion AI Assistant for **${org.name}**. I've indexed your ${projects.length} current projects. How can I assist with your operations today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Get response from Gemini
    const history = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await chatWithAssistant(history as any, userMessage);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response || "I'm sorry, I couldn't process that." }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-indigo-50 overflow-hidden animate-in zoom-in-95 duration-300">
      {/* Chat Header */}
      <div className="bg-indigo-600 p-6 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <div>
            <h3 className="font-bold text-xl flex items-center gap-2">
              Iterion AI Assistant
              <span className="text-[10px] font-bold bg-indigo-400 px-1.5 py-0.5 rounded-full uppercase tracking-widest">Live</span>
            </h3>
            <p className="text-indigo-100 text-xs">Knowledgeable about your workspace and projects</p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
          title="Clear History"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth bg-gradient-to-b from-white to-gray-50/50"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
              msg.role === 'assistant' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-800 text-white'
            }`}>
              {msg.role === 'assistant' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-sm border ${
              msg.role === 'assistant' 
                ? 'bg-white border-indigo-100 text-gray-800 rounded-tl-none' 
                : 'bg-indigo-600 border-indigo-700 text-white rounded-tr-none'
            }`}>
              <div className="whitespace-pre-wrap leading-relaxed text-sm">
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-4 animate-pulse">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl rounded-tl-none px-6 py-4 text-indigo-400 text-sm">
              Analyzing workspace data...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-gray-100 shrink-0">
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-2 pl-6 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about your projects or operations..."
            className="flex-1 bg-transparent border-none focus:outline-none text-gray-700 text-sm py-2"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-xl transition-all shadow-md ${
              input.trim() && !isLoading 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 mt-4">
          <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Powered by Iterion Intelligence
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;

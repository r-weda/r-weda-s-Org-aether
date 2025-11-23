import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';
import { generateChatResponse } from '../services/geminiService';
import { ChatMessage, AiPersonality, UserStats } from '../types';

interface AiChatProps {
  addXp: (amount: number) => void;
}

export const AiChat: React.FC<AiChatProps> = ({ addXp }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Identity verified. I am online. Select a personality protocol and state your query.', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [personality, setPersonality] = useState<AiPersonality>(AiPersonality.JARVIS);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const text = await generateChatResponse(userMsg.text, history, personality);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: text,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMsg]);
      addXp(20);
    } catch (error) {
       setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'System Failure: Unable to connect to neural core. Check API Key.',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {/* Settings Bar */}
      <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Bot className="text-neon-blue" />
          <select 
            value={personality}
            onChange={(e) => setPersonality(e.target.value as AiPersonality)}
            className="bg-black/50 border border-gray-700 text-white rounded p-2 focus:border-neon-blue outline-none text-sm"
          >
            {Object.values(AiPersonality).map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        
        <div className="text-neon-green text-xs flex items-center gap-1">
          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
          SYSTEM ONLINE
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 glass-panel rounded-xl p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-xl p-4 ${
              msg.role === 'user' 
                ? 'bg-neon-blue/10 border border-neon-blue/30 text-white rounded-tr-none' 
                : 'bg-neon-purple/10 border border-neon-purple/30 text-gray-200 rounded-tl-none'
            }`}>
              <div className="flex items-center gap-2 mb-2 text-xs opacity-50 uppercase tracking-widest">
                {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                {msg.role === 'user' ? 'Operator' : personality.split(' ')[0]}
              </div>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-neon-purple/10 border border-neon-purple/30 text-neon-purple rounded-xl p-4 rounded-tl-none flex items-center gap-2">
              <Sparkles className="animate-spin" size={16} />
              <span className="animate-pulse">Processing neural pathways...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="glass-panel p-2 rounded-xl flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Enter command or query..."
          className="flex-1 bg-transparent border-none outline-none text-white px-4 placeholder-gray-500"
        />
        <button 
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="p-3 bg-neon-blue/20 text-neon-blue rounded-lg hover:bg-neon-blue hover:text-black transition-all disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};
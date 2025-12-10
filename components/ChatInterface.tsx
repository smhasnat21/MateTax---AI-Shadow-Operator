import React, { useRef, useEffect, useState } from 'react';
import { Message } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { ICONS } from '../constants';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isTyping }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;
    onSendMessage(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  return (
    <div className="flex flex-col h-full bg-brand-beige">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-40 text-brand-dark">
            <div className="w-16 h-16 mb-4 text-brand-dark">
              {ICONS.Analytics}
            </div>
            <p className="font-mono text-sm">Awaiting Instructions...</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-4 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-brand-medium text-white rounded-br-none'
                  : 'bg-white text-brand-text rounded-bl-none border border-brand-pale'
              }`}
            >
              {msg.role === 'model' && (
                 <div className="mb-2 flex items-center gap-2 border-b border-brand-pale/30 pb-1">
                    <span className="text-xs font-mono font-bold text-brand-medium uppercase tracking-wider">MateTax AI</span>
                 </div>
              )}
              <div className="prose prose-sm max-w-none">
                <MarkdownRenderer content={msg.content} />
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start w-full">
            <div className="bg-white rounded-2xl rounded-bl-none px-5 py-4 border border-brand-pale shadow-sm flex items-center gap-1">
              <div className="w-2 h-2 bg-brand-medium rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-brand-medium rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-brand-medium rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-brand-beige/95 backdrop-blur-sm border-t border-brand-dark/10">
        <div className="max-w-4xl mx-auto relative bg-white rounded-xl shadow-lg border border-brand-medium/20 focus-within:ring-2 focus-within:ring-brand-medium focus-within:border-transparent transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Describe the operational requirement..."
            className="w-full px-4 py-4 pr-12 bg-transparent text-brand-text placeholder-brand-text/40 focus:outline-none resize-none max-h-40 rounded-xl"
          />
          <button
            onClick={() => handleSubmit()}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 bottom-2 p-2 rounded-lg bg-brand-dark text-brand-beige hover:bg-brand-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>
        <p className="text-center text-xs text-brand-dark/40 mt-3 font-mono">
          MateTax may produce inaccurate information about specific tax laws. Consult a CPA for legal advice.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
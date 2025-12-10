import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import { AppView, ChatSession, Message, QuickAction } from './types';
import { streamChatResponse } from './services/geminiService';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Helper to get active messages
  const activeMessages = sessions.find(s => s.id === activeSessionId)?.messages || [];

  const handleNewChat = (initialPrompt?: string) => {
    const newSession: ChatSession = {
      id: uuidv4(),
      title: 'New Operation',
      messages: [],
      createdAt: Date.now(),
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setCurrentView(AppView.CHAT);

    if (initialPrompt) {
        // Use a slight timeout to allow the state to settle before "sending" the initial prompt
        setTimeout(() => {
           handleSendMessage(initialPrompt, newSession.id);
        }, 100);
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    handleNewChat(action.promptPrefix);
  };

  const handleSendMessage = async (text: string, sessionIdOverride?: string) => {
    const targetSessionId = sessionIdOverride || activeSessionId;
    if (!targetSessionId) return;

    // 1. Add User Message
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setSessions(prev => prev.map(session => {
      if (session.id === targetSessionId) {
        // Update title if it's the first message
        const title = session.messages.length === 0 ? text.slice(0, 30) + '...' : session.title;
        return { ...session, title, messages: [...session.messages, userMessage] };
      }
      return session;
    }));

    setIsTyping(true);

    try {
        // 2. Prepare Placeholder for AI Message
        const aiMessageId = uuidv4();
        const aiPlaceholder: Message = {
            id: aiMessageId,
            role: 'model',
            content: '',
            timestamp: Date.now(),
            isStreaming: true
        };

        setSessions(prev => prev.map(session => {
            if (session.id === targetSessionId) {
                return { ...session, messages: [...session.messages, aiPlaceholder] };
            }
            return session;
        }));

        // Get current history for context
        const currentSession = sessions.find(s => s.id === targetSessionId);
        // We need to merge the *previous* state with the new user message for the API call context
        // But since setState is async, we look at `sessions` + `userMessage` manually or trust the functional update
        // To be safe, let's grab the history from the session finder above plus the user message
        const contextMessages = currentSession ? [...currentSession.messages, userMessage] : [userMessage];

        // 3. Stream Response
        await streamChatResponse(contextMessages, text, (streamedText) => {
            setSessions(prev => prev.map(session => {
                if (session.id === targetSessionId) {
                    const updatedMessages = session.messages.map(msg => 
                        msg.id === aiMessageId ? { ...msg, content: streamedText } : msg
                    );
                    return { ...session, messages: updatedMessages };
                }
                return session;
            }));
        });

        // Finalize (remove streaming flag)
        setSessions(prev => prev.map(session => {
            if (session.id === targetSessionId) {
                const updatedMessages = session.messages.map(msg => 
                    msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg
                );
                return { ...session, messages: updatedMessages };
            }
            return session;
        }));

    } catch (error) {
        console.error("Chat Error", error);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-brand-beige text-brand-text font-sans">
      <Sidebar 
        currentView={currentView}
        onChangeView={setCurrentView}
        onNewChat={() => handleNewChat()}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <main className="flex-1 flex flex-col h-full relative">
        {/* Mobile Header Trigger */}
        <div className="md:hidden p-4 bg-brand-dark text-brand-beige flex items-center justify-between shadow-md">
            <span className="font-bold">MateTax</span>
            <button onClick={() => setIsMobileOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </div>

        {currentView === AppView.DASHBOARD && (
          <Dashboard onQuickAction={handleQuickAction} />
        )}

        {currentView === AppView.CHAT && (
          <ChatInterface 
            messages={activeMessages} 
            onSendMessage={(text) => handleSendMessage(text)}
            isTyping={isTyping}
          />
        )}
      </main>
    </div>
  );
};

export default App;
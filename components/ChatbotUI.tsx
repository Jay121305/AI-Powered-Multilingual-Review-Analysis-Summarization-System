import React, { useState, useEffect, useRef } from 'react';
import { ProductAnalysisChatbot, createVoiceAssistant } from '../services/conversationalAI';
import { Language } from '../types';

interface ChatUIProps {
  language: Language;
}

export const ChatbotUI: React.FC<ChatUIProps> = ({ language }) => {
  const [chatbot] = useState(() => new ProductAnalysisChatbot(Date.now().toString(), language));
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMsg = inputMessage;
    setInputMessage('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await chatbot.sendMessage(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = async () => {
    setIsListening(true);
    try {
      const voiceAssistant = createVoiceAssistant(language);
      await voiceAssistant.processVoiceCommand();
      // Update messages from chatbot history
      const history = chatbot.getConversationHistory();
      setMessages(history.slice(-10));
    } catch (error) {
      console.error('Voice input error:', error);
    } finally {
      setIsListening(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <h3 className="font-bold">Product Analysis Assistant</h3>
            <p className="text-xs opacity-90">Powered by AI</p>
          </div>
        </div>
        <button 
          onClick={() => {
            chatbot.clearHistory();
            setMessages([]);
          }}
          className="text-sm px-3 py-1 bg-indigo-700 rounded hover:bg-indigo-800"
        >
          Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 mt-10">
            <p className="text-lg font-medium mb-2">👋 Welcome!</p>
            <p className="text-sm">Ask me about any product and I'll help you analyze it.</p>
            <div className="mt-4 space-y-2 text-sm text-left max-w-md mx-auto">
              <p className="text-slate-600 font-medium">Try asking:</p>
              <button 
                onClick={() => setInputMessage("Analyze iPhone 15 Pro")}
                className="block w-full text-left px-4 py-2 bg-white rounded shadow-sm hover:shadow-md transition"
              >
                "Analyze iPhone 15 Pro"
              </button>
              <button 
                onClick={() => setInputMessage("Compare OnePlus 12 vs Samsung S24")}
                className="block w-full text-left px-4 py-2 bg-white rounded shadow-sm hover:shadow-md transition"
              >
                "Compare OnePlus 12 vs Samsung S24"
              </button>
              <button 
                onClick={() => setInputMessage("What's the battery life like?")}
                className="block w-full text-left px-4 py-2 bg-white rounded shadow-sm hover:shadow-md transition"
              >
                "What's the battery life like?"
              </button>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-white shadow-md rounded-bl-none'
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans text-sm">{msg.content}</pre>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white shadow-md p-3 rounded-lg rounded-bl-none">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4 bg-white rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about any product..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            disabled={isLoading}
          />
          <button
            onClick={handleVoiceInput}
            disabled={isListening || isLoading}
            className={`px-4 py-2 rounded-lg transition ${
              isListening 
                ? 'bg-red-600 text-white animate-pulse' 
                : 'bg-slate-200 hover:bg-slate-300'
            }`}
            title="Voice input"
          >
            {isListening ? '🎙️ Listening...' : '🎤'}
          </button>
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

// Floating Chat Button Component
export const FloatingChatButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all hover:scale-110 z-50"
      title="Open Chat Assistant"
    >
      <span className="text-3xl">💬</span>
    </button>
  );
};

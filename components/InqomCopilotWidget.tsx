

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SparklesIcon, CloseIcon, SendIcon } from '../src/constants/icons'; 

interface CopilotMessage {
  id: string;
  text: string;
  sender: 'user' | 'copilot';
  timestamp: string;
}

// Ensure API_KEY is accessed from process.env as per guidelines
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn("API_KEY for Gemini is not set. Inqom Copilot will not function.");
}


const InqomCopilotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'copilot-welcome',
      text: 'Bonjour ! Je suis Inqom Copilot. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'copilot',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const getAICopilotResponse = async (promptText: string): Promise<string> => {
    if (!ai) {
        return "Désolé, le service Copilot n'est pas disponible pour le moment (clé API manquante).";
    }
    setIsLoading(true);
    try {
      // Fix: The 'gemini-2.5-flash-preview-04-17' model is prohibited. You must use 'gemini-2.5-flash' instead.
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash', 
        contents: promptText,
        config: {
          systemInstruction: "You are Inqom Copilot, a helpful AI assistant for accounting and business management on Your COGEP. Answer user questions clearly and concisely. If the question is outside the scope of accounting, finance, or business management related to Your COGEP, politely state that you cannot answer in French.",
          thinkingConfig: { thinkingBudget: 0 } 
        }
      });
      return response.text;
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
             return "Désolé, la clé API pour le Copilot n'est pas valide. Veuillez contacter l'administrateur.";
        }
      }
      return "Désolé, une erreur s'est produite lors de la connexion au Copilot. Veuillez réessayer plus tard.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: CopilotMessage = {
      id: `user-${Date.now()}`,
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    const aiResponseText = await getAICopilotResponse(userMessage.text);
    
    const aiMessage: CopilotMessage = {
      id: `copilot-${Date.now()}`,
      text: aiResponseText,
      sender: 'copilot',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, aiMessage]);
  };
  
  const formatTimestamp = (isoTimestamp: string): string => {
    const date = new Date(isoTimestamp);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };


  return (
    <>
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-[9998] bg-theme-primary-500 text-[color:var(--color-primary-contrast-text)] p-4 rounded-full shadow-lg hover:bg-theme-primary-600 focus:outline-none focus:ring-2 focus:ring-theme-primary-300 focus:ring-offset-2 transition-all duration-150 ease-in-out flex items-center group"
          aria-label="Ouvrir Inqom Copilot"
        >
          <SparklesIcon className="w-6 h-6" />
          <span className="ml-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 fixed right-16 bg-theme-primary-500 p-2 rounded-md shadow-md whitespace-nowrap">
            Inqom Copilot
          </span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[9999] w-full max-w-sm h-[calc(100vh-100px)] max-h-[550px] bg-white rounded-xl shadow-xl flex flex-col overflow-hidden border border-theme-primary-200 transition-all duration-300 ease-out transform scale-100 opacity-100 sm:bottom-8 sm:right-8">
          {/* Header */}
          <div className="bg-theme-primary-600 text-[color:var(--color-primary-contrast-text)] p-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold flex items-center">
              <SparklesIcon className="w-5 h-5 mr-2" />
              Inqom Copilot
            </h3>
            <button 
              onClick={toggleChat} 
              className="text-theme-primary-200 hover:text-[color:var(--color-primary-contrast-text)]"
              aria-label="Fermer le Copilot"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-theme-primary-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`
                    p-3 rounded-xl max-w-[85%] shadow-sm
                    ${msg.sender === 'user' ? 'bg-theme-primary-500 text-[color:var(--color-primary-contrast-text)] rounded-br-none' : 'bg-white text-theme-text border border-theme-secondary-gray-200 rounded-bl-none'}
                  `}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
                <span className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-theme-primary-200 mr-1' : 'text-gray-400 ml-1'}`}>
                  {formatTimestamp(msg.timestamp)}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-lg bg-white text-theme-text border border-theme-secondary-gray-200 rounded-bl-none max-w-[85%] shadow-sm">
                  <p className="text-sm italic text-gray-500">Copilot réfléchit...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-theme-secondary-gray-200 bg-white flex items-center space-x-2">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Posez votre question..."
              className="flex-1 p-2.5 pr-10 border border-theme-secondary-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-theme-primary-300 focus:border-theme-primary-500 resize-none"
              rows={1}
              style={{ maxHeight: '80px', overflowY: 'auto' }}
              aria-label="Message pour Inqom Copilot"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="p-2.5 bg-theme-primary-500 text-[color:var(--color-primary-contrast-text)] rounded-lg hover:bg-theme-primary-600 disabled:bg-theme-secondary-gray-300 focus:outline-none focus:ring-2 focus:ring-theme-primary-300 focus:ring-offset-1"
              aria-label="Envoyer le message"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InqomCopilotWidget;
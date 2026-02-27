
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ConversationThread, ChatMessage, ModuleComponentProps } from './types'; 
import { mockConversations } from './data'; 
import { formatMessageTimestamp } from './utils'; 
import { StarIcon, PaperAirplaneIcon, MagnifyingGlassIcon } from './icons'; 

const ConversationsPage: React.FC<ModuleComponentProps> = (props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState<ConversationThread[]>(mockConversations);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(mockConversations.length > 0 ? mockConversations[0].id : null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedConversationId) {
      setConversations(prevConvs =>
        prevConvs.map(conv =>
          conv.id === selectedConversationId ? { ...conv, unread: false } : conv
        )
      );
    }
  }, [selectedConversationId]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, selectedConversationId]);


  const filteredConversations = useMemo(() => {
    if (!searchTerm) return conversations;
    return conversations.filter(conv =>
      conv.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessagePreview.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.contactTag.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [conversations, searchTerm]);

  const selectedConversation = useMemo(() => {
    return conversations.find(conv => conv.id === selectedConversationId);
  }, [conversations, selectedConversationId]);

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(prevConvs =>
      prevConvs.map(conv =>
        conv.id === id ? { ...conv, isFavorite: !conv.isFavorite } : conv
      )
    );
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversationId) return;

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'User',
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isUserMessage: true,
    };

    setConversations(prevConvs =>
      prevConvs.map(conv =>
        conv.id === selectedConversationId
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessagePreview: message.text.substring(0, 30) + (message.text.length > 30 ? '...' : ''),
              lastMessageDate: new Date().toLocaleDateString('fr-FR'),
            }
          : conv
      )
    );
    setNewMessage('');
  };
  
  // Basic JSX structure
  return (
    <div className="flex h-[calc(100vh-var(--header-height,150px)-2rem)] bg-white rounded-xl shadow-lg border border-gray-200"> {/* Adjusted height */}
      {/* Sidebar for conversation list */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-theme-primary-500 focus:border-theme-primary-500"
            />
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.sort((a,b) => new Date(b.messages[b.messages.length-1]?.timestamp || 0).getTime() - new Date(a.messages[a.messages.length-1]?.timestamp || 0).getTime() ).map((conv) => (
            <div
              key={conv.id}
              onClick={() => handleSelectConversation(conv.id)}
              className={`p-4 cursor-pointer hover:bg-theme-primary-50 ${selectedConversationId === conv.id ? 'bg-theme-primary-100' : ''} border-b border-gray-100`}
            >
              <div className="flex justify-between items-center mb-1">
                <h4 className={`text-sm font-semibold ${selectedConversationId === conv.id ? 'text-theme-primary-700' : 'text-theme-text'}`}>{conv.contactName}</h4>
                <button onClick={(e) => handleToggleFavorite(conv.id, e)} className="text-gray-400 hover:text-yellow-500">
                  <StarIcon className={`w-4 h-4 ${conv.isFavorite ? 'fill-yellow-400 text-yellow-500' : 'text-gray-400'}`} />
                </button>
              </div>
              <p className={`text-xs truncate ${selectedConversationId === conv.id ? 'text-theme-primary-600' : 'text-gray-500'}`}>{conv.lastMessagePreview}</p>
              <div className="flex justify-between items-center mt-1">
                <span className={`text-xs ${selectedConversationId === conv.id ? 'text-theme-primary-500' : 'text-gray-400'}`}>{conv.lastMessageDate}</span>
                {conv.unread && <span className="w-2 h-2 bg-theme-primary-500 rounded-full"></span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="w-2/3 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-slate-50">
              <h3 className="text-lg font-semibold text-theme-text">{selectedConversation.contactName}</h3>
              <span className="text-xs text-theme-primary-500 bg-theme-primary-100 px-2 py-0.5 rounded-full">{selectedConversation.contactTag}</span>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-100">
              {selectedConversation.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isUserMessage ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-xl shadow-sm ${msg.isUserMessage ? 'bg-theme-primary-500 text-white rounded-br-none' : 'bg-white text-theme-text rounded-bl-none'}`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.isUserMessage ? 'text-theme-primary-200 text-right' : 'text-gray-400 text-left'}`}>
                      {formatMessageTimestamp(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200 bg-white flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Écrivez votre message..."
                className="flex-1 p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-theme-primary-500 focus:border-theme-primary-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="ml-3 p-2.5 bg-theme-primary-500 text-white rounded-lg hover:bg-theme-primary-600 disabled:bg-gray-300"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Sélectionnez une conversation pour commencer à discuter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsPage;

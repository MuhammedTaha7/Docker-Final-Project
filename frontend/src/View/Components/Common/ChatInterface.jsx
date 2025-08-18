import '../../../CSS/Components/Global/ChatInterface.css';
import { useChat } from '../../../Context/ChatContext';
import React, { useEffect, useState, useRef } from 'react';
import { Send } from 'react-feather';

const ChatInterface = ({ contact, onClose, currentUserId, context = 'eduSphere' }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const {
    getMessagesForContact,
    sendMessage,
    loadMessages,
    markMessagesAsRead,
  } = useChat ? useChat() : {
    getMessagesForContact: () => [],
    sendMessage: () => {},
    loadMessages: () => {},
    markMessagesAsRead: () => {},
  };

  // Load messages from API when contact changes
  useEffect(() => {
    if (!contact?.id) return;

    // Load messages and mark them as read    
    loadMessages(contact.id, context);
    markMessagesAsRead(contact.id, context);
  }, [contact?.id, context]);

  // Update displayed messages when context or contact changes
  useEffect(() => {
    if (!contact?.id) return;
    const updatedMessages = getMessagesForContact(contact.id, context);
    setMessages(updatedMessages);
  }, [contact?.id, context, getMessagesForContact]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(contact.id, newMessage, context);
      setNewMessage('');
      
      // Simulate typing indicator
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const getContextDisplay = () => {
    return context === 'community' ? 'Community Chat' : 'EduSphere Chat';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Minimize view
  if (isMinimized) {
    return (
      <div className="chat-interface-minimized">
        <div className="chat-header-minimized" onClick={() => setIsMinimized(false)}>
          <div className="chat-contact-info">
            <div className="chat-contact-avatar">
              {contact?.title?.[0] || 'U'}
            </div>
            <div className="chat-contact-details">
              <span className="chat-contact-name">{contact?.title}</span>
              <span className="chat-status-indicator">●</span>
            </div>
          </div>
          <button className="chat-close-button" onClick={(e) => { e.stopPropagation(); onClose(); }}>×</button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="chat-contact-info">
          <div className="chat-contact-avatar">
            {contact?.title?.[0] || 'U'}
          </div>
          <div className="chat-contact-details">
            <span className="chat-contact-name">{contact?.title}</span>
            <span className="chat-context">
              {isTyping ? 'typing...' : getContextDisplay()}
            </span>
          </div>
        </div>
        <div className="chat-header-buttons">
          <button className="chat-minimize-button" onClick={() => setIsMinimized(true)}>−</button>
          <button className="chat-close-button" onClick={onClose}>×</button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="no-messages">
            <div className="no-messages-icon">💬</div>
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${
                message.senderId === currentUserId ? 'sent' : 'received'
              }`}
            >
              <div className="message-content">{message.content}</div>
              <div className="message-timestamp">
                {formatTimestamp(message.timestamp)}
                {message.senderId === currentUserId && (
                  <span className="message-status">
                    {message.status === 'read' ? '✓✓' : '✓'}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <input
          ref={inputRef}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Type a message in ${getContextDisplay()}...`}
          className="chat-input"
        />
        <button 
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          className="chat-send-button"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
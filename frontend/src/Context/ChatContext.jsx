import React, { createContext, useContext, useEffect, useState } from "react";
import {
  connectWebSocket,
  sendMessage as sendSocketMessage,
} from "../websocket/chatSocket";
import { 
  fetchChatMessages, 
  getUnreadCount,
  markMessagesAsRead as markMessagesAsReadAPI,
  sendChatMessage as sendChatMessageAPI,
} from "../Api/CommunityAPIs/chatApi";
import { AuthContext } from "../Context/AuthContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { authData } = useContext(AuthContext);
  
  // State for community messages
  const [communityMessagesMap, setCommunityMessagesMap] = useState({});
  const [communityUnreadMessages, setCommunityUnreadMessages] = useState({});
  
  const [activeChatId, setActiveChatId] = useState(null);
  
  // Loading state
  const [loadingContacts, setLoadingContacts] = useState({});

  useEffect(() => {
    if (!authData?.id) return;

    // Connect to community WebSocket context
    connectWebSocket(authData.id, 'community', (incomingMessage) => {
      handleIncomingMessage(incomingMessage);
    });

    // Load initial unread counts
    loadUnreadCounts();

  }, [authData?.id]);

  // Load unread counts from server
  const loadUnreadCounts = async () => {
    if (!authData?.id) return;
    
    try {
      const communityUnread = await getUnreadCount(authData.id);
      // Assuming the API returns a map of { contactId: unreadCount }
      if (typeof communityUnread === 'object') {
        setCommunityUnreadMessages(communityUnread);
      }
    } catch (error) {
      console.error("Failed to load unread counts:", error);
    }
  };

  const handleIncomingMessage = (incomingMessage) => {
    const otherId =
      incomingMessage.senderId === authData.id
        ? incomingMessage.receiverId
        : incomingMessage.senderId;

    setCommunityMessagesMap((prev) => {
      const updated = {
        ...prev,
        [otherId]: [...(prev[otherId] || []), incomingMessage],
      };
      return updated;
    });

    if (
      incomingMessage.receiverId === authData.id &&
      otherId !== activeChatId
    ) {
      setCommunityUnreadMessages((prev) => {
        const updated = {
          ...prev,
          [otherId]: (prev[otherId] || 0) + 1,
        };
        return updated;
      });
    }
  };

  const loadMessages = async (contactId) => {
    if (!authData?.id || !contactId) return;
    
    if (communityMessagesMap[contactId] && communityMessagesMap[contactId].length > 0) {
      return;
    }

    const loadingKey = `${contactId}_community`;
    if (loadingContacts[loadingKey]) {
      return;
    }

    setLoadingContacts(prev => ({ ...prev, [loadingKey]: true }));

    try {
      const data = await fetchChatMessages(authData.id, contactId);

      setCommunityMessagesMap((prev) => ({
        ...prev,
        [contactId]: data || [],
      }));

    } catch (error) {
      console.error(`Failed to load messages for ${contactId}:`, error);
    } finally {
      setLoadingContacts(prev => {
        const updated = { ...prev };
        delete updated[loadingKey];
        return updated;
      });
    }
  };

  const sendMessage = (receiverId, content) => {
    if (!content.trim()) return;

    const msg = {
      senderId: authData.id,
      receiverId,
      content: content.trim(),
      context: 'community'
    };

    // Send via WebSocket
    sendSocketMessage(msg, 'community');

    // Update local state immediately for sender
    const localMessage = { 
      ...msg, 
      timestamp: new Date().toISOString(),
      id: `temp_${Date.now()}`
    };

    setCommunityMessagesMap((prev) => ({
      ...prev,
      [receiverId]: [
        ...(prev[receiverId] || []),
        localMessage,
      ],
    }));
  };

  const getMessagesForContact = (contactId) => {
    const messages = communityMessagesMap[contactId] || [];
    return messages;
  };

  const markMessagesAsRead = async (contactId) => {
    setCommunityUnreadMessages((prev) => {
      const updated = { ...prev };
      delete updated[contactId];
      return updated;
    });
    
    setActiveChatId(contactId);

    try {
      await markMessagesAsReadAPI(authData.id, contactId);
    } catch (error) {
      console.error('Failed to mark messages as read on server:', error);
    }
  };

  const getUnreadCount = () => {
    const total = Object.values(communityUnreadMessages).reduce((total, count) => total + count, 0);
    return total;
  };

  const getUnreadCountForContact = (contactId) => {
    return communityUnreadMessages[contactId] || 0;
  };

  const getContactsWithMessages = () => {
    return Object.keys(communityMessagesMap).filter(contactId => communityMessagesMap[contactId].length > 0);
  };

  return (
    <ChatContext.Provider
      value={{
        // Messages
        communityMessagesMap,
        loadMessages,
        sendMessage,
        getMessagesForContact,
        
        // Unread tracking
        communityUnreadMessages,
        markMessagesAsRead,
        getUnreadCount,
        getUnreadCountForContact,
        
        // Active chat
        activeChatId,
        
        // Utility functions
        getContactsWithMessages,
        loadingContacts,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
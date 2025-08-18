import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;
let connectedContexts = new Map(); // Map of context -> callback

export const connectWebSocket = (userId, context = 'eduSphere', onMessageReceived) => {
  // Store the callback for this context
  connectedContexts.set(context, onMessageReceived);

  // If already connected, just subscribe to the new context
  if (stompClient && stompClient.connected) {
    subscribeToContext(userId, context, onMessageReceived);
    return Promise.resolve();
  }

  // Create new connection
  try {
    const socket = new SockJS("http://localhost:8080/ws");

    stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        // Subscribe to all contexts that were requested
        connectedContexts.forEach((callback, ctx) => {
          subscribeToContext(userId, ctx, callback);
        });
      },
      onDisconnect: () => {
        connectedContexts.clear();
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
      }
    });

    stompClient.activate();
    
  } catch (error) {
    console.error("Failed to create WebSocket connection:", error);
  }
};

const subscribeToContext = (userId, context, onMessageReceived) => {
  if (!stompClient || !stompClient.connected) {
    console.error("Cannot subscribe: WebSocket not connected");
    return;
  }

  const topic = `/topic/messages/${context}/${userId}`;
  
  try {
    const subscription = stompClient.subscribe(topic, (msg) => {
      try {
        const body = JSON.parse(msg.body);
        onMessageReceived(body);
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    });
    
    return subscription;
    
  } catch (error) {
    console.error(`Failed to subscribe to ${context} topic:`, error);
  }
};

export const sendMessage = (message, context = 'eduSphere') => {
  if (!stompClient || !stompClient.connected) {
    console.error("Cannot send message: WebSocket not connected");
    return false;
  }

  try {
    const destination = context === 'eduSphere' 
      ? "/app/chat.sendMessage" 
      : "/app/community.sendMessage";
    
    const messageWithContext = { ...message, context };
    
    stompClient.publish({
      destination: destination,
      body: JSON.stringify(messageWithContext),
    });
    
    return true;
    
  } catch (error) {
    console.error(`Failed to send ${context} message:`, error);
    return false;
  }
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    connectedContexts.clear();
  }
};

export const isConnected = () => {
  return stompClient && stompClient.connected;
};

export const getConnectionState = () => {
  if (!stompClient) return "DISCONNECTED";
  if (stompClient.connected) return "CONNECTED";
  return "DISCONNECTED";
};
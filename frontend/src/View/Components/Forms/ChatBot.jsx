import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import styles from "../../../CSS/Components/Forms/chatBot.module.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const ChatUI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [inputFocused, setInputFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);

  // Scroll to the bottom of the chat body whenever a new message is added
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatLog]);

  // Add welcome message when chat opens for the first time
  useEffect(() => {
    if (isOpen && chatLog.length === 0) {
      const welcomeMessage = {
        sender: "bot",
        text: "Hello! I'm your EduSphere assistant! 👋\nHow can I help you today?",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatLog([welcomeMessage]);
    }
  }, [isOpen, chatLog.length]);

  // Function to format bot response text
  const formatBotResponse = (text) => {
    return text
      .split('\n')
      .map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < text.split('\n').length - 1 && <br />}
        </React.Fragment>
      ));
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = {
      sender: "user",
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatLog((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    if (!isOpen) setIsOpen(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/chat`, { message });
      const botResponse = response.data.response;

      // Simulate typing delay for better UX
      setTimeout(() => {
        setChatLog((prev) => [
          ...prev,
          {
            sender: "bot",
            text: botResponse,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
        setIsTyping(false);
      }, 800);

    } catch (error) {
      console.error("Error sending message to bot:", error);
      setTimeout(() => {
        setChatLog((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "I'm sorry, I'm having trouble connecting. Please try again later. 😔",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
        setIsTyping(false);
      }, 500);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setChatLog([]);
    const welcomeMessage = {
      sender: "bot",
      text: "Chat cleared! How can I help you? 😊",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setChatLog([welcomeMessage]);
  };

  return (
    <>
      <div className={`${styles.chatUiContainer} ${isOpen ? styles.open : ""}`}>
        <div className={styles.chatHeader}>
          <img
            src="https://img.icons8.com/?size=100&id=uZrQP6cYos2I&format=png&color=000000"
            alt="bot"
            className={styles.chatAvatar}
          />
          <div className={styles.chatInfo}>
            <h4>EduSphere Assistant</h4>
            <span className={styles.status}>🟢 Online</span>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.clearBtn}
              onClick={clearChat}
              title="Clear chat"
            >
              🗑️
            </button>
            <button
              className={styles.closeBtn}
              onClick={() => {
                setIsOpen(false);
                setInputFocused(false);
              }}
              title="Close chat"
            >
              ✕
            </button>
          </div>
        </div>

        <div className={styles.chatBody} ref={chatBodyRef}>
          {chatLog.map((msg, i) => (
            <div key={i} className={`${styles.chatBubble} ${styles[msg.sender]}`}>
              <div className={styles.messageContent}>
                {msg.sender === "bot" ? formatBotResponse(msg.text) : msg.text}
              </div>
              <div className={styles.meta}>
                <span className={styles.time}>{msg.time}</span>
                {msg.sender === "user" && <span className={styles.check}>✔</span>}
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className={`${styles.chatBubble} ${styles.bot} ${styles.typingIndicator}`}>
              <div className={styles.typingDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className={styles.meta}>
                <span className={styles.time}>typing...</span>
              </div>
            </div>
          )}
        </div>

        <img
          className={styles.floatingBot}
          src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnVsbHFoOTU4bnM2M21uNmtpaGlmY21mYWExNTdvZ2hqMW8xc214NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/7ni5vUVSDW17DXyxrz/giphy.gif"
          alt="Floating Bot"
        />

        <div className={styles.chatFooter}>
          <input
            type="text"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
          />
          <button 
            onClick={handleSend} 
            disabled={!message.trim() || isTyping}
            className={isTyping ? styles.sending : ""}
          >
            {isTyping ? "..." : "➤"}
          </button>
        </div>
      </div>

      {!isOpen && (
        <div className={`${styles.chatInputBar} ${inputFocused ? styles.focused : ""}`}>
          <img
            src="https://img.icons8.com/?size=100&id=uZrQP6cYos2I&format=png&color=000000"
            alt="bot"
            className={styles.chatIcon}
          />
          <input
            type="text"
            placeholder="Ask me anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
          />
          <button onClick={handleSend} disabled={!message.trim()}>
            Send
          </button>
        </div>
      )}
    </>
  );
};

export default ChatUI;
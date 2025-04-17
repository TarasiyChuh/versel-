import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './ChatRoom.css';

const ChatRoom = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem('token');
  let currentUserId = null;
  try {
    if (token) currentUserId = jwtDecode(token).id;
  } catch (e) {
    console.error('JWT decode error:', e);
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/chats/${chatId}/messages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(data);
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error('Fetch messages error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [chatId, token]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !token || isSending) return;
    setIsSending(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/chats/${chatId}/sendMessage`,
        { content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage('');
      await fetchMessages();
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-title">Чат</h2>

      <div className="messages-container">
        {isLoading && (
          <div className="loader-container">
            <div className="spinner"></div>
          </div>
        )}
        {messages.map(msg => {
          const isSent = String(msg.sender._id) === String(currentUserId);
          return (
            <div
              key={msg._id}
              className={`message ${isSent ? 'sent' : 'received'}`}
            >
              <div className="message-header">
                <span className="username">{msg.sender.username}</span>
                <span className="timestamp">
                  {new Date(msg.createdAt).toLocaleTimeString('uk-UA', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="message-content">{msg.content}</div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input-container">
        <input
          type="text"
          value={newMessage}
          disabled={isSending}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
          placeholder="Введіть повідомлення"
          className="message-input"
          aria-label="Введіть повідомлення"
        />
        <button
          onClick={handleSendMessage}
          className="send-button"
          disabled={isSending || !newMessage.trim()}
          aria-label={isSending ? 'Відправлення…' : 'Відправити повідомлення'}
        >
          {isSending ? (
            <div className="sending-spinner" />
          ) : (
            <svg
              className="send-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="24"
              height="24"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
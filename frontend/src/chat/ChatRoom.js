import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ChatRoom.css';

const ChatRoom = ({ currentUserId }) => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/chats/${chatId}/messages`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [chatId]);
  
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/chats/${chatId}/sendMessage`,
        { content: newMessage },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  

  return (
    <div className="chat-container">
      <h2 className="chat-title">Чат</h2>
      <div className="messages-container">
        {messages.map(message => (
          <div
            key={message._id}
            className={`message ${message.sender._id === currentUserId ? 'sent' : 'received'}`}
          >
            <strong>{message.sender.username}:</strong> {message.content}
          </div>
        ))}
      </div>
      <div className="message-input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Введіть повідомлення"
          className="message-input"
        />
        <button onClick={handleSendMessage} className="send-button">Відправити</button>
      </div>
    </div>
  );
};

export default ChatRoom;
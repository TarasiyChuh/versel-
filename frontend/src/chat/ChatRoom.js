import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './ChatRoom.css';

const ChatRoom = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Отримуємо токен і визначаємо currentUserId
  const token = localStorage.getItem('token');
  let currentUserId;

  try {
    if (token) {
      const decoded = jwtDecode(token);
      currentUserId = decoded.id; // Припускаємо, що ID у полі "id"
      console.log('Current User ID from token:', currentUserId);
    } else {
      console.log('Токен відсутній у localStorage');
      currentUserId = null;
    }
  } catch (error) {
    console.error('Помилка розшифровки токена:', error);
    currentUserId = null;
  }

  // Функція для завантаження повідомлень
  const fetchMessages = async () => {
    if (!token) {
      console.log('Токен відсутній, неможливо завантажити повідомлення');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/chats/${chatId}/messages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(response.data);
      console.log('Завантажені повідомлення:', response.data);
    } catch (error) {
      console.error('Помилка завантаження повідомлень:', error);
    }
  };

  // Завантаження повідомлень при зміні chatId
  useEffect(() => {
    fetchMessages();
  }, [chatId, token]);

  // Відправка нового повідомлення
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    if (!token) {
      console.log('Токен відсутній, неможливо відправити повідомлення');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/chats/${chatId}/sendMessage`,
        { content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Замість додавання локально, оновлюємо весь список із сервера
      await fetchMessages();
      setNewMessage('');
      console.log('Нове повідомлення відправлено:', response.data);
    } catch (error) {
      console.error('Помилка відправки повідомлення:', error);
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-title">Чат</h2>
      <div className="messages-container">
        {messages.map(message => {
          const isSent = String(message.sender._id) === String(currentUserId);
          console.log(`Message ${message._id}: Is sent? ${isSent}`);
          return (
            <div
              key={message._id}
              className={`message ${isSent ? 'sent' : 'received'}`}
            >
              <strong>{message.sender.username}:</strong> {message.content}
            </div>
          );
        })}
      </div>
      <div className="message-input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          placeholder="Введіть повідомлення"
          className="message-input"
        />
        <button onClick={handleSendMessage} className="send-button">Відправити</button>
      </div>
    </div>
  );
};

export default ChatRoom;
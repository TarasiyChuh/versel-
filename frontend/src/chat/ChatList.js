import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ChatsList.css'; // Імпорт CSS-файлу

const ChatsList = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/chats/chats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChats(data);
      } catch (err) {
        console.error('Error fetching chats:', err);
      }
    };
    fetchChats();
  }, []);

  const me = JSON.parse(localStorage.getItem('user')).id;

  return (
    <div className="container">
      <h2 className="title">Ваші чати</h2>
      <ul className="chat-list">
        {chats.map((chat) => {
          if (!Array.isArray(chat.users) || !Array.isArray(chat.messages)) return null;

          const other = chat.users.find((u) => String(u._id) !== me);
          if (!other) return null;

          const lastMessage = chat.messages[chat.messages.length - 1];
          const lastMessageContent = lastMessage ? lastMessage.content : 'Немає повідомлень';
          const lastMessageTime = lastMessage
            ? new Date(lastMessage.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '';

          return (
            <Link key={chat._id} to={`/chat/${chat._id}`} className="chat-link">
              <li className="chat-item">
                <div className="avatar">{other.username[0].toUpperCase()}</div>
                <div className="chat-info">
                  <div className="username">{other.username}</div>
                  <p className="last-message">{lastMessageContent}</p>
                </div>
                <span className="timestamp">{lastMessageTime}</span>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatsList;
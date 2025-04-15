import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaTrash, FaImage } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import './GeminiChat.css';

function GeminiChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const chatWindowRef = useRef(null);
  const fileInputRef = useRef(null);

  const baseUrl = `${process.env.REACT_APP_API_URL}/api/gemini-chat`;

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() && !image) return;

    const userMessage = {
      id: uuidv4(),
      text: input,
      image: image ? URL.createObjectURL(image) : null,
      sender: 'user',
    };
    setMessages([...messages, userMessage]);
    setInput('');
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('message', input);
      formData.append('sessionId', sessionId || '');
      if (image) formData.append('image', image);

      const response = await axios.post(baseUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const geminiMessage = {
        id: uuidv4(),
        text: response.data.reply,
        image: response.data.imageUrl || null,
        sender: 'gemini',
      };
      setMessages((prev) => [...prev, geminiMessage]);
      setSessionId(response.data.sessionId);
    } catch (error) {
      const errorMessage = {
        id: uuidv4(),
        text: `Ой, щось пішло не так: ${error.message}. Спробуй ще раз!`,
        sender: 'gemini',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
    } else {
      alert('Вибери зображення (JPEG, PNG, GIF)!');
    }
  };

  const handleClearChat = async () => {
    if (!sessionId) return;

    try {
      await axios.delete(`${baseUrl}/session/${sessionId}`);
      setMessages([]);
      setSessionId(null);
    } catch (error) {
      console.error('Помилка очищення:', error);
    }
  };

  return (
    <div className="gemini-chat-container">
      <h2>Чат із Cosmo AI</h2>
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.sender === 'user' ? 'user-message' : 'gemini-message'}`}
          >
            {msg.image && <img src={msg.image} alt="Зображення" className="chat-image" />}
            {msg.text}
          </div>
        ))}
        {loading && <div className="chat-message gemini-message">Cosmo думає...</div>}
      </div>
      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Напиши щось..."
          className="chat-input"
          disabled={loading}
        />
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
        <button
          type="button"
          className="image-button"
          onClick={() => fileInputRef.current.click()}
          disabled={loading}
        >
          <FaImage />
        </button>
        <button type="submit" className="send-button" disabled={loading}>
          <FaPaperPlane />
        </button>
        <button
          type="button"
          className="clear-button"
          onClick={handleClearChat}
          disabled={loading || !sessionId}
        >
          <FaTrash />
        </button>
      </form>
    </div>
  );
}

export default GeminiChat;

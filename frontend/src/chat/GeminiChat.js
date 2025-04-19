import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaTrash, FaImage, FaTimes } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import './GeminiChat.css';

function GeminiChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // Стан для прев’ю
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const chatWindowRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  const baseUrl = `${process.env.REACT_APP_API_URL}/api/gemini-chat`;

  // Автоскрол вниз
  const scrollToBottom = useCallback(() => {
    chatWindowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, []);

  useEffect(() => {
    scrollToBottom();
    inputRef.current?.focus();
  }, [messages, loading, scrollToBottom]);

  // Обробка вибору зображення
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file?.type.startsWith('image/')) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Показуємо прев’ю
    } else {
      alert('Вибери зображення (JPEG, PNG, GIF)!');
    }
  };

  // Видалення зображення
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    fileInputRef.current.value = '';
  };

  // Відправка повідомлення
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !image) || loading) return;

    const userMessage = {
      id: uuidv4(),
      text: input,
      image: image ? URL.createObjectURL(image) : null,
      sender: 'user',
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setImage(null);
    setImagePreview(null); // Очищаємо прев’ю
    fileInputRef.current.value = '';
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('message', userMessage.text);
      formData.append('sessionId', sessionId || '');
      if (image) formData.append('image', image);

      const { data } = await axios.post(baseUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const geminiMessage = {
        id: uuidv4(),
        text: data.reply,
        image: data.imageUrl || null,
        sender: 'gemini',
        createdAt: new Date().toISOString(),
      };
      setSessionId(data.sessionId);
      setMessages((prev) => [...prev, geminiMessage]);
    } catch (err) {
      const errorMessage = {
        id: uuidv4(),
        text: `Ой, щось не так: ${err.message}`,
        sender: 'gemini',
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Очищення чату
  const handleClearChat = async () => {
    if (!sessionId) return;
    if (!window.confirm('Точно очистити всю переписку з Cosmo AI?')) return;
    try {
      await axios.delete(`${baseUrl}/session/${sessionId}`);
      setMessages([]);
      setSessionId(null);
    } catch (err) {
      console.error('Clear error:', err);
    }
  };

  return (
    <div className="gemini-chat-container">
      <h2>Чат із Cosmo AI</h2>

      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.sender}-message fade-in`}
          >
            {msg.image && (
              <div className="image-preview">
                <img src={msg.image} alt="img" />
              </div>
            )}
            <div className="text">{msg.text}</div>
            <div className="timestamp">
              {new Date(msg.createdAt).toLocaleTimeString('uk-UA', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-message gemini-message typing">
            Cosmo думає…
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        {/* Прев’ю зображення до відправки */}
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Попередній перегляд" />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="remove-img"
            >
              <FaTimes />
            </button>
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Напиши щось..."
          className="chat-input"
          disabled={loading}
        />

        <input
          type="file"
          accept="image/*"
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

        <button
          type="submit"
          className="send-button"
          disabled={loading || (!input.trim() && !image)}
        >
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
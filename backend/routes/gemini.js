const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

// Налаштування Multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Ліміт 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Дозволені лише JPEG, PNG, GIF!'));
    }
  },
});

// Налаштування Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash'; // Змінив на модель із підтримкою зображень
const model = genAI.getGenerativeModel({
  model: modelName,
  systemInstruction: `
    Ти — веселий і дружній AI-асистент на ім'я Cosmo, створений для українського ігрового порталу. 
    Спілкуйся українською, використовуй сучасний і неформальний стиль, додавай гумор і позитив. 
    Ти експерт у відеоіграх, веб-розробці (React, Node.js) та поп-культурі. 
    Відповідай коротко, але чітко, уникай складних термінів. 
    Якщо код, дай робоче рішення з поясненням. 
    Якщо аналізуєш зображення, опиши його або дай відповідь на основі вмісту. 
    Не знаєш? Жартуй: "Ой, цього я не знаю, але тримай анекдот про пікселі!" 😜
  `,
  generationConfig: {
    temperature: 0.9,
    maxOutputTokens: 4096,
  },
});

// Сесії
const sessions = {};

// POST /api/gemini-chat
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const image = req.file;
    console.log('Запит:', {
      message,
      sessionId,
      model: modelName,
      image: image ? image.mimetype : null,
    });

    if (!message && !image) {
      console.log('Помилка: немає повідомлення чи зображення');
      return res.status(400).json({ error: 'Надішли повідомлення або зображення!' });
    }

    const currentSessionId = sessionId || uuidv4();
    console.log('Сесія:', currentSessionId);

    if (!sessions[currentSessionId]) {
      console.log('Нова сесія');
      sessions[currentSessionId] = {
        history: [],
        chatSession: model.startChat({ history: [] }),
        createdAt: Date.now(),
      };
    }

    const session = sessions[currentSessionId];
    const content = [];

    if (message) {
      content.push({ text: message });
    }

    if (image) {
      content.push({
        inlineData: {
          data: image.buffer.toString('base64'),
          mimeType: image.mimetype,
        },
      });
      if (!message) {
        content.unshift({ text: 'Опиши це зображення' });
      }
    }

    session.history.push({ role: 'user', parts: content });

    console.log('Запит до Gemini:', content);
    const result = await session.chatSession.sendMessage(content);
    const response = await result.response;
    const text = response.text();
    console.log('Відповідь Gemini:', text);

    session.history.push({ role: 'model', parts: [{ text }] });

    res.json({ reply: text, sessionId: currentSessionId });
  } catch (error) {
    console.error('Помилка Gemini:', {
      message: error.message,
      code: error.code,
      status: error.status,
      details: error.details || 'немає деталей',
    });
    res.status(500).json({ error: `Cosmo заглючило: ${error.message}. Пробуй ще! 😅` });
  }
});

// DELETE /session/:sessionId
router.delete('/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  console.log('Очищення сесії:', sessionId);
  delete sessions[sessionId];
  res.json({ message: 'Сесію скинуто!' });
});

module.exports = router;
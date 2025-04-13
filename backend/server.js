require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Дозволяємо лише конкретні домени (де твій фронтенд)
const allowedOrigins = [
  'https://versel-ashen.vercel.app/', // Замінити на актуальний URL
];

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // дозволяємо запит
    } else {
      callback(new Error('Not allowed by CORS')); // якщо домен не в списку
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Включаємо CORS на сервері
app.use(cors(corsOptions));

app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Підключення маршрутів
app.use('/api/auth', require('./routes/auth'));      // Аутентифікація та користувачі
app.use('/api/games', require('./routes/game'));
app.use('/api/comments', require('./routes/comment'));
app.use('/api/chats', require('./routes/chat'));
app.use('/api/library', require('./routes/library'));

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

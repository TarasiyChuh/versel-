const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Game = require('../models/Game');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'supersecretkey123'; // Має збігатися з ключем у server.js

// Реєстрація
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Усі поля обов’язкові' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Користувач з таким email вже існує' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'Реєстрація успішна' });
  } catch (error) {
    console.error('Помилка при реєстрації:', error);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
});

// Вхід
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Усі поля обов’язкові' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Невірний email або пароль' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Невірний email або пароль' });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error('Помилка при вході:', error);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
});

// Отримання всіх користувачів (без паролів)
router.get('/users', async (req, res) => {
  try {
    // Використовуємо _id, username, email, createdAt; якщо користувачів немає, повернеться порожній масив
    const users = await User.find().select('_id username email createdAt');
    res.json(users);
  } catch (error) {
    console.error('Помилка при отриманні користувачів:', error);
    res.status(500).json({ message: 'Помилка сервера при отриманні списку користувачів' });
  }
});

// Отримання всіх ігор
router.get('/games', async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    console.error('Помилка при отриманні ігор:', error);
    res.status(500).json({ message: 'Помилка сервера при отриманні списку ігор' });
  }
});

// Отримання гри за її ID
router.get('/games/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Гра не знайдена' });
    }
    res.json(game);
  } catch (error) {
    console.error('Помилка при отриманні гри:', error);
    res.status(500).json({ message: 'Помилка сервера при отриманні гри' });
  }
});

// Маршрут для отримання даних користувача за ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});


// Маршрут для отримання ігор користувача
router.get('/games/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('games');
    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }
    res.json(user.games); // Повертаємо список ігор користувача
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера', error: err.message });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('library');
    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      library: user.library  // тепер поле заповнене
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

module.exports = router;

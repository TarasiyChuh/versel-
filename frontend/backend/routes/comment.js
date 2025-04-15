const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const User = require('../models/User');
const Game = require('../models/Game');

// Додавання нового коментаря
router.post('/', async (req, res) => {
  try {
    const { comment, userId, gameId } = req.body; // Отримуємо дані з фронтенду

    // Перевіряємо, чи є користувач із таким ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }

    // Перевіряємо, чи є гра з таким ID
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Гру не знайдено' });
    }

    // Створюємо новий коментар
    const newComment = new Comment({
      comment,
      userId,
      gameId,
    });

    // Зберігаємо коментар у базі даних
    await newComment.save();

    // Підтягуємо дані користувача (username) до коментаря
    const populatedComment = await Comment.findById(newComment._id).populate('userId', 'username');

    // Повертаємо коментар із правильним userId
    res.status(201).json({ message: 'Коментар успішно додано', comment: populatedComment });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Не вдалося додати коментар' });
  }
});

// Отримання всіх коментарів для гри
router.get('/:gameId', async (req, res) => {
  try {
    const gameId = req.params.gameId;
    // Отримуємо коментарі і підтягуємо username користувача
    const comments = await Comment.find({ gameId }).populate('userId', 'username');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при отриманні коментарів', error: err.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const mongoose = require('mongoose');

// Отримання всіх ігор
router.get('/', async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching games' });
  }
});

// Отримання гри за її ID
router.get('/:id', async (req, res) => {
  // Перевірка чи ID має правильний формат
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid game ID format' });
  }

  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Отримання рейтингу гри (GET /:id/rating)
router.get('/:id/rating', async (req, res) => {
  // Перевірка формату ID гри
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Невірний формат ID гри' });
  }
  
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Гру не знайдено' });
    }
    const votes = game.ratings.length;
    // Якщо немає голосів, повертаємо 0.00
    res.json({ averageRating: votes > 0 ? game.rating.toFixed(2) : "0.00", votes });
  } catch (error) {
    console.error("Помилка отримання рейтингу гри:", error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// Оновлення оцінки гри (PUT /:id/rating)
router.put('/:id/rating', async (req, res) => {
  const { rating, userId } = req.body;

  // Валідація вхідних даних
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Оцінка повинна бути між 1 і 5' });
  }
  if (!userId) {
    return res.status(400).json({ message: 'userId є обов’язковим' });
  }

  // Перевірка формату ID гри
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Невірний формат ID гри' });
  }

  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Гру не знайдено' });
    }

    // Шукаємо, чи користувач вже оцінив гру
    const existingRating = game.ratings.find(r => r.userId.toString() === userId);
    if (existingRating) {
      // Оновлюємо існуючу оцінку
      existingRating.rating = rating;
    } else {
      // Додаємо новий голос
      game.ratings.push({ userId, rating });
    }

    // Перерахунок середнього рейтингу
    const totalRating = game.ratings.reduce((sum, rate) => sum + rate.rating, 0);
    game.rating = game.ratings.length > 0 ? totalRating / game.ratings.length : 0;

    // Додатковий лог для перевірки, що оновлюється потрібна гра
    console.log("Оновлення рейтингу для гри:", game._id, "Новий середній рейтинг:", game.rating);

    await game.save();
    // Повертаємо тільки мінімальні необхідні дані
    res.json({
      message: 'Рейтинг збережено',
      gameId: game._id,
      averageRating: game.rating.toFixed(2),
      votes: game.ratings.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Серверна помилка', error: error.message });
  }
});

// routes/games.js
router.get('/top/all', async (req, res) => {
  try {
    const topGames = await Game.find({}, {
      title: 1,
      rating: 1,
      genre: 1,
      photo: 1,
      description: 1,
      link: 1,
      ratings: 1
    })
      .sort({ rating: -1 })
      .limit(10);

    const gamesWithVotes = topGames.map(game => ({
      _id: game._id,
      title: game.title,
      rating: game.rating.toFixed(2),
      genre: game.genre,
      photo: game.photo,
      description: game.description,
      link: game.link,
      votes: game.ratings.length
    }));

    res.json(gamesWithVotes);
  } catch (error) {
    console.error('Помилка при отриманні топ ігор:', error.message);
    res.status(500).json({ message: 'Сервер здох при спробі дістати топ' });
  }
});


module.exports = router;

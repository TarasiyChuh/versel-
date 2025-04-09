const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { addGameToLibrary } = require('../controllers/libraryController');  // Імпортуємо контролер бібліотеки

// Маршрут для додавання гри до бібліотеки
router.post('/add', addGameToLibrary);

router.get('/library/user/:userId', async (req, res) => {
  try {
    // Заповнюємо поле "library", яке має ref до моделі Game
    const user = await User.findById(req.params.userId).populate('library');
    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }
    // Формуємо об'єкти з повною інформацією про кожну гру
    const libraryData = user.library.map(game => ({
      _id: game._id,
      title: game.title,
      description: game.description,
      photo: game.photo,
      genre: game.genre,
      rating: game.rating,
      ratings: game.ratings // якщо потрібні оцінки
    }));
    res.json(libraryData);
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера', error: err.message });
  }
});

  

module.exports = router;  // Експортуємо маршрут

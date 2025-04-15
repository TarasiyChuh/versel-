const User = require('../models/User');
const Game = require('../models/Game');

// Контролер для додавання гри в бібліотеку користувача
const addGameToLibrary = async (req, res) => {
  try {
    const { userId, gameData } = req.body;

    // 1. Перевіряємо, чи існує така гра
    let game = await Game.findOne({ title: gameData.title });
    if (!game) {
      game = await Game.create(gameData);  // Якщо гри немає, створюємо нову
    }

    // 2. Знаходимо користувача
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 3. Додаємо гру в бібліотеку користувача, якщо її там ще немає
    if (!user.library.includes(game._id)) {
      user.library.push(game._id);
      await user.save();
    }

    res.status(200).json({ message: 'Game added to library', game });
  } catch (error) {
    console.error('Error adding game:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addGameToLibrary };  // Експортуємо контролер

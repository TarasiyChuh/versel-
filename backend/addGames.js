const mongoose = require('mongoose');
const Game = require('./models/Game');  // Тут імпортуємо модель гри

// Підключаємося до бази даних
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Функція для додавання нової гри
const addGame = async () => {
  try {
    const newGame = new Game({
      title: 'atomic',
      description: 'Forza Horizon 5 — це екстремальні гонки, де гравці можуть випробувати',
      link: '',  // Лінк залишимо порожнім
      photo: 'images/AtomicHeart.jpg',
      genre: 'Гонки'  // Тепер жанр просто рядок
    });

    await newGame.save();  // Зберігаємо гру в базу
    console.log('Game added:', newGame);
  } catch (err) {
    console.log('Error adding game:', err);
  }
};

// Викликаємо функцію додавання гри
addGame();

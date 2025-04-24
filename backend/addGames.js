const mongoose = require('mongoose');
const Game = require('./models/Game');  // Тут імпортуємо модель гри

// Підключаємося до бази даних
mongoose.connect('mongodb+srv://cuhnickijtaras:Cuhnickijtaras12345@cluster0.ygtdqhn.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Функція для додавання нової гри
const addGame = async () => {
  try {
    const newGame = new Game({
      title: 'Bru & Boegie: Episode 1',
      description: 'Наводьте та клацайте свій шлях через повністю намальований від руки й анімований світ із повністю озвученим акторським складом та оригінальним саундтреком.',
      link: 'https://www.dropbox.com/scl/fi/s8k34lal0frfi7uqj9vm6/GetdaMILK_WIN.zip?rlkey=gnhyxadibvncm1g26uzzp9egr&st=rhk338h1&dl=1',  
      photo: '/images/Bru.png',
      genre: 'Пригода'  // Тепер жанр просто рядок
    });

    await newGame.save();  // Зберігаємо гру в базу
    console.log('Game added:', newGame);
  } catch (err) {
    console.log('Error adding game:', err);
  }
};

// Викликаємо функцію додавання гри
addGame();

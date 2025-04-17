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
      title: 'Mushrooming',
      description: 'Ви чули про гриб, якого не існує?Аттікус має. А тепер він сховався в орендованій хатині під лісом, де востаннє бачили міфічного великого боровика 25 років тому. Підживлений рідкою відвагою, він вирушає в ліс, переслідуючи легенди та славу.',
      link: '',  // Лінк залишимо порожнім
      photo: '/images/grub.png',
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

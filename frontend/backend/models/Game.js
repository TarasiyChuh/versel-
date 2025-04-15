const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  link: { type: String, required: false },
  photo: { type: String, required: true },
  genre: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 3 },
  ratings: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, rating: { type: Number, min: 1, max: 5 } }] // Зберігаємо оцінки користувачів
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);

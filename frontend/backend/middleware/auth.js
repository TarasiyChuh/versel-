const jwt = require('jsonwebtoken');
const JWT_SECRET = 'supersecretkey123'; // Переконайся, що такий самий у всіх місцях

module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Відсутній токен або неправильний формат' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT Error:', err.message); // корисно при дебазі
    return res.status(401).json({ message: 'Недійсний або протухлий токен' });
  }
};

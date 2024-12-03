const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'secretKey';

const signup = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: Date.now(), email, password: hashedPassword };
  return jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
};

const login = async (email, password, storedUser) => {
  if (storedUser && await bcrypt.compare(password, storedUser.password)) {
    return jwt.sign({ id: storedUser.id }, secretKey, { expiresIn: '1h' });
  } else {
    throw new Error('Invalid credentials');
  }
};

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
};

module.exports = { signup, login, authenticateToken };
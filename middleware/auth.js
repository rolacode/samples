const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const validateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    res.status(401).json({ message: 'You needed to login to access this route.' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, async (error, payload) => {
    if (error) {res.status(401).json({ message: 'You have to logged in to access this route.' });
      return;
    }

    const user = await User.findOne({ where: { id: payload.id } });
    if (!user) {res.status(401).json({ message: 'You must be logged in to access this route.' });
      return;
    }
    req.user = user;
    next();
  });
};

module.exports = {
  validateToken
};
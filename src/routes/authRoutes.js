const express = require('express');
const { register, login, me } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { validate } = require('../utils/validators');

const router = express.Router();

router.post('/register', validate([
  { field: 'name', required: true },
  { field: 'email', required: true, type: 'email' },
  { field: 'password', required: true, minLength: 6 },
  { field: 'phone', required: true },
]), register);

router.post('/login', validate([
  { field: 'email', required: true, type: 'email' },
  { field: 'password', required: true },
]), login);

router.get('/me', authMiddleware, me);

module.exports = router;

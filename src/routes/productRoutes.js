const express = require('express');
const {
  addProduct,
  getProductsByWebsite,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const { validate } = require('../utils/validators');

const router = express.Router();

router.post('/add', authMiddleware, validate([
  { field: 'websiteId', required: true },
  { field: 'title', required: true },
  { field: 'price', required: true, type: 'number', min: 0 },
]), addProduct);
router.get('/:websiteId', getProductsByWebsite);
router.put('/update/:id', authMiddleware, updateProduct);
router.delete('/delete/:id', authMiddleware, deleteProduct);

module.exports = router;

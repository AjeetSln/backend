const express = require('express');
const {
  createWebsite,
  getMyWebsites,
  updateWebsite,
  getWebsiteBySlug,
  publishWebsite,
} = require('../controllers/websiteController');
const authMiddleware = require('../middleware/authMiddleware');
const { checkSubscriptionMiddleware } = require('../middleware/checkSubscriptionMiddleware');
const { validate } = require('../utils/validators');

const router = express.Router();

router.post('/create', authMiddleware, validate([{ field: 'businessName', required: true }]), createWebsite);
router.get('/my', authMiddleware, getMyWebsites);
router.put('/update', authMiddleware, updateWebsite);
router.post('/publish', authMiddleware, checkSubscriptionMiddleware, publishWebsite);
router.get('/:slug', getWebsiteBySlug);

module.exports = router;

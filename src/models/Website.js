const mongoose = require('mongoose');

const websiteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    businessName: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    logo: { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    upiId: { type: String, default: '' },
    themeColor: { type: String, default: '#2563eb' },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    isPublished: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = mongoose.model('Website', websiteSchema);

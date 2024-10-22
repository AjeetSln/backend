const mongoose = require('mongoose');  // Use require() to import mongoose

const MenuSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },  // e.g., "Appetizer", "Main Course", etc.
    image: { type: String },  // URL of the image (optional)
    available: { type: Boolean, default: true }
});

// Define and export the Menu model
const Menu = mongoose.model('Menu', MenuSchema);
module.exports = Menu;  // Use module.exports to export the model

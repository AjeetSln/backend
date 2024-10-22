const express = require('express');  // Requiring express
const router = express.Router();  // Using express.Router
const Menu = require('../models/Menu');  // Requiring the Menu model

// Middleware to parse JSON bodies

// Route to get all menu items
router.get("/getallMenu", async(req, res) => {
    try {
        const menu = await Menu.find();  // Fetch all documents from the Menu collection
        res.status(200).json(menu);  // Respond with the menu data in JSON format
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/search', async (req, res) => {
    const searchQuery = req.query.q; // Retrieve search query from the request
    try {
        const results = await Menu.find({
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search by name
                { category: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search by category
            ],
        });
        res.json(results); // Return the matching food items
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// Export the router using module.exports
module.exports = router;

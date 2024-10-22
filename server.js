const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const MenuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const Admin = require('./models/Admin_1'); 
const dbconfig = require('./db'); // Database configuration

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000; // Use port from env or default to 3000

// Connect to the MongoDB database
dbconfig();

// Middleware
app.use(cors());
app.use(express.json());

// Use the MenuRoutes for any requests to /api/menu
app.use('/api/menu', MenuRoutes);

// Admin login route
app.post('/admin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Admin.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password); // Use bcrypt to compare passwords
      if (isMatch) {
        return res.json({ success: true, message: "Login successful" });
      } else {
        return res.status(401).json({ success: false, message: "Incorrect password" });
      }
    } else {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
  } catch (error) {
    console.error('Admin login error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Use order routes for /api/orders
app.use('/api/orders', orderRoutes);

// Default route to check if the server is running
app.get('/test', (req, res) => {
  res.send('Test route works');
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

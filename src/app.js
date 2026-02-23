const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const websiteRoutes = require('./routes/websiteRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const errorHandlerMiddleware = require('./middleware/errorHandlerMiddleware');
const { sendResponse } = require('./utils/response');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => sendResponse(res, 200, true, 'API is running'));

app.use('/api/auth', authRoutes);
app.use('/api/website', websiteRoutes);
app.use('/api/product', productRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/subscription', subscriptionRoutes);

app.use((req, res) => sendResponse(res, 404, false, 'Route not found'));
app.use(errorHandlerMiddleware);

module.exports = app;

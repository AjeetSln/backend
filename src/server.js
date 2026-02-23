const dotenv = require('dotenv');
const app = require('./app');
const connectDB = require('./config/db');

dotenv.config();

const PORT = process.env.PORT || 5000;

const bootstrap = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`BizPage API running on port ${PORT}`);
  });
};

bootstrap();

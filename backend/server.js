const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const app = require('./src/app');

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running in development mode`);
    console.log(`🚀 Listening on port ${PORT}`);
    console.log(`🌐 Accessible locally at: http://${process.env.HOST_IP}:${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});

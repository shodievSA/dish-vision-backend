const express = require('express');
const cors = require('cors');
const aiRouter = require('./routes/ai');

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'https://ec55-86-62-2-251.ngrok-free.app'
];

app.use(express.json({ limit: '10mb' }));
app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`${origin} origin is not allowed!`));
        }
    },
    credentials: true
}));

app.use('/api/v1/ai', aiRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

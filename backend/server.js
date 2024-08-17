require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const API_URL = 'https://contact-manager-backend-chi.vercel.app/'
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use(`${API_URL}/contacts`,require('./routes/contactRoutes'));
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  
const PORT = process.env.PORT || 5004;
app.listen(PORT, ()=> console.log(`Server Running on port ${PORT}`))
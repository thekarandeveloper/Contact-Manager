require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');


const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/contacts',require('./routes/contactRoutes'));

const PORT = process.env.PORT || 5004;
app.listen(PORT, ()=> console.log(`Server Running on port ${PORT}`))
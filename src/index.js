const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./routes/routes')
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MongoDBURL)
.then(()=> console.log('MongoDB is connected'))
.catch((e)=> console.log(e))

app.use('/',router)

app.listen(5000, () => console.log('Server is running on port 5000'));

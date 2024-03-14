const express = require('express');
const cors = require('cors');
const app = express();
const { dbConnection } = require('./config/dbConnection');
const userRoutes = require('./routes/user');
const bodyParser = require('body-parser');
const path = require('path');

dbConnection();
app.use(express.json());
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(cors());
app.use('/user', userRoutes);
app.get('/', async(req, res) => {
    res.send('Hello World...');
});

app.listen(8000, () => { console.log('App is listen on : 8000,') });
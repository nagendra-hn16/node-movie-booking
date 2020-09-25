const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
require('dotenv/config');

app.use(bodyParser.json());

const loginRoute = require('./routes/login');

app.use('/login', loginRoute);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

//Connect to mongo DB
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true }, 
    () => console.log('connected to DB!!')
)

// Listen to all requests made to port 5000
app.listen(process.env.PORT || 5000);


//mongodb+srv://testUser:1qaz@WSX@cluster0.ut0mj.mongodb.net/<dbname>?retryWrites=true&w=majority
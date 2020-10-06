const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const Locations = require('./models/Locations');
var session = require('express-session')
const MongoStore  = require('connect-mongo')(session);
require('dotenv/config');

// Enable CORS for all requests
app.use(cors());

app.use(bodyParser.json());

//Connect to mongo DB
mongoose.connect(
    process.env.DB_CONNECTION,
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useMongoClient: true
    },
    () => console.log('connected to DB!!')
)

const sessionStore = new MongoStore({
    mongooseConnection: mongoose.connection,
    dbName: 'session'
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    key: 'sessionId',
    saveUninitialized: false,
    cookie: {
        secure: false,
        path: "/",
        domain: "herokuapp.com",
        maxAge: 24 * 60 * 60 * 1000
    }
}))

const loginRoute = require('./routes/login');

app.use('/login', loginRoute);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.get('/locations', (req, res) => {
    try {
        console.log('locations');
        Locations.find({}, (error, result) => {
            console.log('result', result);
            if (error) {
                res.json({
                    msg: error
                })
            } else {
                res.set({'Access-Control-Allow-Origin': '*'}).json(result);
            }
        })
    } catch (error) {
        res.json({
            msg: error
        })
    }
})

// Listen to all requests made
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
});

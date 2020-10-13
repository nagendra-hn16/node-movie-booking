const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
// const Locations = require('./models/Locations');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
require('dotenv/config');

//Connect to mongo DB
mongoose.connect(
    process.env.DB_CONNECTION,
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => console.log('connected to DB!!')
);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const sessionStore = new MongoStore({
    mongooseConnection: mongoose.connection,
    collection: 'sessionstore'
})

// Enable CORS for all requests
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Set-Cookie, Origin, X-Requested-With, Accept');
    next();
})

app.use(session({
    key: 'sessionId',
    secret: 'key',
    resave: false,
    store: sessionStore,
    saveUninitialized: true,
    cookie: {
        secure: false,
        expires: 60000
    }
}));

const loginRoute = require('./routes/login');
const movieRoute = require('./routes/movie');

app.use('/login', loginRoute);
app.use('/movie', movieRoute);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

// Listen to all requests made
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
});

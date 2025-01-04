if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoStore = require('connect-mongo');
const User = require('./models/User');
const userRouter = require('./routes/users');
const port = process.env.PORT;
//think of concurrently or similar tool else use seperate terminals to run both frontend and backend at the same time.

const secret = process.env.COOKIE_SECRET || "a_secret_key";
const DB_URL = "mongodb://127.0.0.1:27017/ChatApp";

mongoose.connect(DB_URL, {
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',() => {
    console.log("connected to db");
});

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser(secret));

const sessionStorage = mongoStore.create({
    mongoUrl: DB_URL
})

app.use(session({
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: false,
    store: sessionStorage,
    cookie: {
        maxAge: 1000*60*60*24
    }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(new localStrategy(passport.authenticate(User.authenticate())));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/users',userRouter);

app.listen(port,() => {
    console.log("chat app running");
})
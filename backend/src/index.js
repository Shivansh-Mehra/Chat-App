import dotenv from 'dotenv';
if(process.env.NODE_ENV !== "production") {
    dotenv.config();
}

import express from 'express';
import authRouter from '../routes/auth.routes.js';
import groupRouter from '../routes/group.routes.js';
const port = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL
import passport from 'passport';
import localStrategy from 'passport-local';
import messageRouter from '../routes/message.routes.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import User from '../models/user.model.js';
import connectToDatabase from '../lib/db.js';   
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {app,server} from '../lib/socket.js';

// const app = express();

//connecting to Db
connectToDatabase(DB_URL);


//config
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(process.env.SECRET));

const sessionStore = MongoStore.create({
    mongoUrl: DB_URL
})

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))

//passport auth
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new localStrategy(User.authenticate()));
// passport.use(User.createStrategy());
// passport.use(new localStrategy(User.authenticate()));
passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

//setup locals
app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    next();
})

app.use('/api/auth',authRouter);
app.use('/api/message',messageRouter);
app.use('/api/group',groupRouter);

app.get('/',(req,res) => {
    res.send("Home");
})

//server start
server.listen(port,() => {});


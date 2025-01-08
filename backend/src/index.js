import dotenv from 'dotenv';
if(process.env.NODE_ENV !== "production") {
    dotenv.config();
}

import express from 'express';
import authRouter from '../routes/auth.routes.js';
const port = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL
import passport from 'passport';
import localStrategy from 'passport-local';
import passportLocalMongoose from 'passport-local-mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import User from '../models/user.model.js';
import connectToDatabase from '../lib/db.js';   
import cookieParser from 'cookie-parser';

const app = express();

//connecting to Db
connectToDatabase(DB_URL);


//config
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

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
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//setup locals
app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    next();
})

app.use('/auth',authRouter);


app.get('/',(req,res) => {
    res.send("Home");
})

app.get('/removeme',(req,res) => {
    res.send("hello login failed");
})

//server start
app.listen(port,() => {
    console.log("server running on "+port);
})


if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const port = process.env.PORT;
//think of concurrently or similar tool else use seperate terminals to run both frontend and backend at the same time.

app.get('/',(req,res) => {
    res.json({"message":"Welcome to chat app"});
})

app.listen(port,() => {
    console.log("chat app running");
})
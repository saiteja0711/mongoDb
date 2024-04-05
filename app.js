const path = require('path');
const fs = require("fs");
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const morgan = require('morgan');
const sequelize = require('./util/database');
const cors = require('cors');
const mongoose = require('mongoose');


const userRouter = require('./routes/users');
const expenseRouter = require('./routes/expenses');
const payment = require('./routes/payment')
const premium = require('./routes/premium')
const forgotPassword = require('./routes/forgotPassword')




const app = express();
const accessLogStream=fs.createWriteStream(
    path.join(__dirname,'access.log'),{
    flags:'a'
});


app.use(cors())
app.use(compression());
app.use(morgan('combined',{stream:accessLogStream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));



app.use('/user',userRouter);
app.use('/expenses',expenseRouter);
app.use('/purchase',payment);
app.use('/premium',premium)
app.use('/password',forgotPassword)

app.use((req,res)=>{
    //console.log('url',req.url)
    res.sendFile(path.join(__dirname,`public/Frontend/${req.url}`))
})

mongoose
      .connect('mongodb+srv://Teja:Teja8081@cluster0.rlclnpx.mongodb.net/expenseTraker')
      .then (result => {
        console.log("Connected!")
        app.listen(3000)
      })
      .catch(err => {
        console.log(err)
      });

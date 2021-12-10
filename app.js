//jshint esversion:6

require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

var secret = process.env.SECRET ;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model('User', userSchema);


app.get('/', function (req, res) {
  res.render('home');
});

app.get('/login', function (req, res) {
  res.render('login');
});

app.get('/register', function (req, res) {
  res.render('register');
});

app.post('/register', function (req, res) {
  
  //Create a new user
  const newUser = new User({
    email : req.body.username,
    password : req.body.password
  });

  //Save to db
  newUser.save(function (error) {
    if (!error) {
      res.render('secrets');
    } else {
      console.log(error);
    }
  });
});

app.post('/login', function (req, res) {
  const { username, password } = req.body;
  User.findOne({ email: username }, function (error, foundUser) {
    if (error) {
      console.log(error);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render('secrets') ;
        }
      }
    }
  })
})

app.listen(3000, function () {
  console.log("http://localhost:3000");
});
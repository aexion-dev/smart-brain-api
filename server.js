const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'devtest',
    database : 'smartbrain'
  }
});

const app = express();

app.use(express.json());
app.use(cors());

//Sign In
app.post('/signin', (req, res) => {signin.handleSignIn(req, res, db, bcrypt) });

//Register
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

//Load User Data
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });

//Update Image Data
app.put('/image', (req, res) => { image.handleImage(req, res, db) });
app.post('/imageurl', (req, res) => { image.handleAPICall(req, res) });


app.listen(3001, ()=> {
  console.log('App is running on port 3001');
});

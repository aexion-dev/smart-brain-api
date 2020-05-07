
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const signout = require('./controllers/signout');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/authorization');
const upload = require('./controllers/upload');
const presigner = require('./controllers/presigner');

if (process.env.NODE_ENV !== 'production') {
  const result = require('dotenv').config();
}

const db = knex({
  client: 'pg',
  connection: {
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
  }
});

const app = express();

app.use(morgan('combined'));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.send('it is working') });

//Sign In
app.post('/signin', signin.signinAuthentication(db, bcrypt));

//Sign Out
app.post('/signout', signout.handleSignOut(db, bcrypt));

// //Register
// app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

//Register
app.post('/register', register.registerAuthentication(db, bcrypt));

//User Data
app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db) });
app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db)});

//Image Data
app.put('/image', auth.requireAuth, (req, res) => { image.handleImage(req, res, db) });
app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleAPICall(req, res) });

//Upload Profile Photo
app.get('/generate-get-url', (req, res) => {presigner.handleAWSGetURL(req, res)});
app.get('/generate-put-url', (req, res) => {presigner.handleAWSPutURL(req, res)});
//app.post('/test-upload', (req, res) => { upload.handlePhotoUpload(req, res)});



app.listen(process.env.SERVER_PORT, ()=> {
  console.log(`App is running on port ${process.env.SERVER_PORT}`);
}).on('error', console.log);

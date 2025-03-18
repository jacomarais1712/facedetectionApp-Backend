const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const dotenv = require('dotenv')
dotenv.config();

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profileid = require('./controllers/profileid');
const image = require('./controllers/image');

const database = knex({
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      user: 'postgres',
      password: process.env.DBPASS,
      database: 'smart-brain',
    },
  });

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json())
app.use(cors())

app.post('/', (req, res) => { res.send('this is working') });
app.post('/signin', (req, res) => { signin.handleSignin(req, res, database, bcrypt) });
app.post('/register', (req, res) => { register.handleRegister(req, res, database, bcrypt) });
app.get('/profile/:id', (req, res) => { profileid.handleProfile(req, res, database) });
app.put('/image', (req, res) => { image.handleImage(req, res, database) });
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });

app.listen(process.env.PORT, () => {
    console.log(`app is running at port ${process.env.PORT}`);
})
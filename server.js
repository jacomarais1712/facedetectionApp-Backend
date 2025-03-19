const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const dotenv = require('dotenv')
dotenv.config();

console.log(process.env.DBPASS);

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profileid = require('./controllers/profileid');
const image = require('./controllers/image');

const database = knex({
    client: 'pg',
    connection: {
      host: process.env.DBHOST,
      port: process.env.DBPORT,
      user: process.env.DBUSER,
      password: process.env.DBPASS,
      database: process.env.DB,
      ssl: {
        rejectUnauthorized: false
      },
    },
  });
  database.raw('SELECT 1')
    .then(() => {
        console.log('Database connected successfully')
    })
    .catch((error) => {
        console.error('Database connection error:', error.message);
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
});

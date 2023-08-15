// ! other import section

const express = require('express');
const cors = require('cors');
const ejs = require('ejs');
const app = express();

require('./config/database');
const user = require('./Model/user.model');

const passport = require('passport');
const session = require('express-session');
const mongoStore = require('connect-mongo');

require('dotenv').config();
const dbUrl = process.env.dbUrl;

require('./config/passport');

// ! some method declare here form import method

app.set('view engine', 'ejs');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', 1); // trust first proxy
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({
      mongoUrl: dbUrl,
      collectionName: 'sessions',
    }),
    // cookie: { secure: true },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ! get method for home route

app.get('/', (request, response) => {
  response.status(200).render('index');
});

// ! get method and post method for login route

const checkLoggedIn = (request, response, next) => {
  if (request.isAuthenticated()) {
    return response.redirect('/profile');
  }
  next();
};

app.get('/login', checkLoggedIn, (request, response) => {
  response.status(200).render('login');
});

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/profile',
  }),
  function (req, res) {
    res.redirect('/');
  }
);

// ! profile route

const checkProfileAuthenticated = (request, response, next) => {
  if (request.isAuthenticated()) return next();
  else response.redirect('/login');
};

app.get('/profile', checkProfileAuthenticated, (request, response) => {
  response.render('profile', { username: request.user.username });
});

// ! logout route
app.get('/logout', (request, response) => {
  try {
    request.logOut((error) => {
      if (error) return next(error);
      response.redirect('/');
    });
  } catch (error) {
    response.status(500).send(error.message);
  }
});

module.exports = app;

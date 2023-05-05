const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const ejs = require('ejs');

const app = express();
const port = 3500;

const csrfProtection = csrf({ cookie: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(csrfProtection);
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  if (req.cookies['username']) {
    // Redirect the user to the dashboard if they already have a cookie
    res.redirect('/dashboard');
  } else {
    // Otherwise, render the login page
    res.render('login', { csrfToken: req.csrfToken() });
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Here you would validate the user's login credentials
  // and set a cookie if they are valid
  // For now, we will just assume that the login is valid

  res.cookie('username', username);
  res.redirect('/dashboard');
});

app.get('/signup', (req, res) => {
  res.render('signup', { csrfToken: req.csrfToken() });
});

app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  // Here you would create a new user account in your database
  // For now, we will just assume that the signup is successful

  res.cookie('username', username);
  res.redirect('/dashboard');
});

app.get('/dashboard', (req, res) => {
  if (req.cookies['username']) {
    // Render the dashboard if the user has a cookie
    res.render('dashboard', { username: req.cookies['username'], csrfToken: req.csrfToken() },{maxAge: 50000, httpOnly:true});
  } else {
    // Otherwise, redirect them to the login page
    res.redirect('/');
  }
});

app.delete('/', csrfProtection, (req, res) => {
  // Verify that the CSRF token in the form matches the one stored in the cookie
  if (req.csrfToken() !== req.cookies['XSRF-TOKEN']) {
    res.status(403).send('Invalid CSRF token');
  } else {
    // Delete the user's session cookie and redirect them to the login page
    res.clearCookie('username');
    res.redirect('/');
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`)
});
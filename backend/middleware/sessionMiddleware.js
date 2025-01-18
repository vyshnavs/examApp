//used to create session for user when loged in
const session = require('express-session');

const sessionMiddleware = session({
  secret: 'yourSecretKey', // Replace with a strong secret key
  resave: false,           // Avoid saving session if not modified
  saveUninitialized: false,// Avoid saving uninitialized session
  cookie: {
    secure: false,         // Set `true` if using HTTPS
    maxAge: 1000 * 60 * 60 // Session expiration time in ms (1 hour)
  }
});

module.exports = sessionMiddleware;

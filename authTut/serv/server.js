const express = require('express');

require('passport');

const User = require('./user');
const app = express();
const LocalStrategy = require('passport-local').Strategy;
const auth = require('./auth');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const users= []

app.use('/auth', auth);
app.use('/user', passport.authenticate('jwt', {session: false}), User);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: 'you secret key' }))
app.use(passport.session())


function checkAuth() {
  return app.use((req, res, next) => {
    if (req.user) next()
    else res.redirect('/login')
  })
}

app.get('/auth', (req, res) => {
    res.send('You hit the home page without restarting the server automatically\n')
  })

app.post('/auth', (req, res) => {
  if (!req.body) return console.error('401'); 
  users.push(User)
  console.log(users)

  res.send(200)
})

passport.use(
  new LocalStrategy((user, password, done) => {
    if (user !== 'test_user')
      return done(null, false, {
        message: 'User not found',
      })
    else if (password !== 'test_password')
      return done(null, false, {
        message: 'Wrong password',
      })

    return done(null, { id: 1, name: 'Test', age: 21 })
  })
)

app.get('/login', (req, res) => {
  res.send('Login page. Please, authorize.')
})

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
 })
)

app.get('/home', checkAuth(), (req, res) => {
  res.send("Home page. You're authorized.")
})

app.listen(3000, () => {
    console.log('Listening on localhost:3000')
})


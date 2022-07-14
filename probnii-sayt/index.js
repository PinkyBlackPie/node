const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');

const passport = require("passport");
const passportJWT = require("passport-jwt");

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const users = [
  {
    id: 1,
    name: 'jonathanmh',
    password: '%2yx4'
  },
  {
    id: 2,
    name: 'test',
    password: 'test'
  }
];

const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'tasmanianDevil';

const strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  const user = users[_.findIndex(users, {id: jwt_payload.id})];
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

passport.use(strategy);

const app = express();
app.use(passport.initialize());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json())

app.get("/", function(req, res) {
  res.json({message: "Express is up!"});
});

app.post("/login", function(req, res) {
  if(req.body.name && req.body.password){
    const name = req.body.name;
    const password = req.body.password;
  }
  const user = users[_.findIndex(users, {name: req.body.name})];
  if( ! user ){
    res.status(401).json({message:"no such user found"});
  }

  if(user.password === req.body.password) {
    const payload = {id: user.id};
    const token = jwt.sign(payload, jwtOptions.secretOrKey);
    res.json({message: "ok", token: token});
  } else {
    res.status(401).json({message:"passwords did not match"});
  }
});

app.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
  res.json({message: "Success! You can not see this without a token"});
});

app.get("/secretDebug",
  function(req, res, next){
    console.log(req.get('Authorization'));
    next();
  }, function(req, res){
    res.json("debugging");
});

app.listen(3000, function() {
  console.log("Express running");
});
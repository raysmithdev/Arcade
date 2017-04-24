const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const serveStatic = require('serve-static');
const cookieParser = require('cookie-parser');

const {BasicStrategy} = require('passport-http');

const jsonParser = require('body-parser').json();
const passport = require('passport');

const mongoose = require('mongoose');

const Arcade = require('./models/arcade')
const {User} = require('./models/users')

mongoose.connect('mongodb://atugman:unc123@ds157529.mlab.com:57529/arcade')
mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(express.static('public'));

app.listen(process.env.PORT || 8080, function(){
  console.log('Running ok')
});

//passport.use(basicStrategy);

app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser());
//app.use(passport.initialize());
//app.use(session());






app.get('/scores', (req, res) => {
  User.find((err, scores) => {
    /*const sortedScores = User.users.aggregate(
   [
     { $sort : { score : -1 } }
   ]
)*/
    if(err)
      res.send(err)
    res.json(scores)
  })
})

app.post('/scores', (req, res) => {
  console.log("working...");
  console.log(req.body);
  const user = new Arcade()
  arcade.name = req.body.name
  arcade.score = req.body.score
  arcade.save((error) => {
    if(error) {
      res.send(error)
    } else {
      res.send('user created')
      //Arcade.find((err, scores) => {
        //if(err)
          //res.send(err)
        //res.json(scores)
      //})
    }
  }
)
});





//AUTH

const basicStrategy = new BasicStrategy((username, password, callback) => {
  let user;
  console.log(username);
  User
    .findOne({username: username})
    .exec()
    .then(_user => {
      user = _user;
      if (!user) {
        return callback(null, false, {message: 'Incorrect username'});
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return callback(null, false, {message: 'Incorrect password'});
      }
      else {
        return callback(null, user)
      }
    });
});


app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(basicStrategy);

passport.serializeUser(function (user, done) {
    done(null, user.id);
    //log in, send back to client
});

passport.deserializeUser(function (user, done) {
    User.findById(_id, function (err, user) {
        done(err, user);
    });
});

app.get('/existing',
  passport.authenticate('basic', {session: false}),
  (req, res) => res.json({user: req.user.apiRepr()})
);

app.patch('/users/:score',
  passport.authenticate('basic', {session: false}),
  (req, res) => {
  const updatedItem = User.update({_id: req.user._id}, {
    score: req.params.score
  }, (err) => {
    if (err) {
      res.json(err)
    } 
    console.log(updatedItem)
    res.json(updatedItem)
  })
});

/*
app.patch('/users/:score',
  passport.authenticate('basic', {session: false}),
  (req, res) => {
    const updatedItem = arcade.users.findByIdAndUpdate( { _id: req.user._id }, {new: true}, { $max: { score: req.params.score } } ); 
  (err) => {
    if (err) {
      res.json(err)
    }
    console.log(updatedItem)
    res.json(updatedItem)
  }
});
*/
//Model.findByIdAndUpdate(id, updateObj, {new: true}, function(err, model) {...

app.post('/users', (req, res) => {
  if (!req.body) {
    return res.status(400).json({message: 'No request body'});
  }

  if (!('username' in req.body)) {
    return res.status(422).json({message: 'Missing field: username'});
  }

  let {username, password, firstName, lastName} = req.body;

  if (typeof username !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: username'});
  }

  username = username.trim();

  if (username === '') {
    return res.status(422).json({message: 'Incorrect field length: username'});
  }

  if (!(password)) {
    return res.status(422).json({message: 'Missing field: password'});
  }

  if (typeof password !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: password'});
  }

  password = password.trim();

  if (password === '') {
    return res.status(422).json({message: 'Incorrect field length: password'});
  }

  // check for existing user
  return User
    .find({username})
    .count()
    .exec()
    .then(count => {
      if (count > 0) {
        return res.status(422).json({message: 'username already taken'});
      }
      // if no existing user, hash password
      return User.hashPassword(password)
    })
    .then(hash => {
      return User
        .create({
          username: username,
          password: hash,
          firstName: firstName,
          lastName: lastName
        })
    })
    .then(user => {
      return res.status(201).json(user.apiRepr());
    })
    .catch(err => {
      res.status(500).json({message: 'Internal server error'})
    });
});

//login
app.get('/users',
  passport.authenticate('basic', {session: true}),
  (req, res) => res.json({user: req.user.apiRepr()})
);

/*
app.get('/logout', function(req, res){
  //passport.authenticate('basic', {session: false}),
  (req, res) => {
  req.logout();
  req.session.destroy({_id: req.user._id});
  console.log(_id);
  res.clearCookie('cookiename');
  res.redirect('/');
}
});


req.session.destroy(function() {
  res.clearCookie('cookieName');
  res.redirect('/');
  });


app.get('/logout', function (req, res){
  req.session.destroy(function (err) {
    res.redirect('/'); //Inside a callback… bulletproof!
  });
});

module.exports = {User};
*/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var security = require('./controllers/security');

// Classes
var LocalStrategy = require('passport-local').Strategy;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession({
  secret: 'test',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
  },
}));

// Passport
passport.serializeUser(security.passportSerializeUser);
passport.deserializeUser(security.passportDeserializeUser);

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
  },
  security.passportLocalStrategy
));

app.use(passport.initialize());
app.use(passport.session());

// Front-End Local Variables
app.use(function declareFrontEndVariables(req, res, next) {
  res.locals.user = { isAuth: false };

  if (req.isAuthenticated()) {
    res.locals.user.isAuth = true;
    res.locals.user.info = req.user.userData;
  }

  return next();
});

app.use('/', require('./routes/index'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/security', require('./routes/api/security'));

app.use('/sdo/', function authCheckRoutes(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
});

app.use('/sdo/', require('./routes/sdo'));

app.use('/api/sdo/', function authCheckAPIs(req, res, next) {
  var err;

  if (req.isAuthenticated()) {
    return next();
  }

  err = new Error('Unauthorized');

  res.status(401).render('error/500', {
    message: err.message,
    error: err,
  });
});

app.use('/api/sdo/', require('./routes/api/sdo'));

// catch 404 and forward to error handler
app.use(function appUseCallback(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function appUseCallback(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function appUseCallback(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});


module.exports = app;

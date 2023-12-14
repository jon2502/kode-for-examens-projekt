var createError = require('http-errors');
var express = require('express');
require('dotenv').config()
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
var flash = require('connect-flash');
const xss = require('xss-clean')

const mongoose = require('mongoose')

//middlewares
const sessioncheck = require('./middleware/sessioncheck')
const autodelete = require('./middleware/autodelete')
const deleteunactiveusers = require('./middleware/deletenotactivemails')
var app = express();

app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000// 1 hour in milliseconds
  }

}));

// Start db connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', function (error) { console.error(error); });
db.once('open', function () { console.log('Connected to database'); });

var usersRouter = require('./routes/users');
var forslagRouter = require('./routes/forslag');
var infoRouter = require('./routes/info')


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(xss())

app.use('/', deleteunactiveusers,usersRouter);
app.use('/forslag',sessioncheck,autodelete, forslagRouter);
app.use('/info',sessioncheck,autodelete, infoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const emailRouter = require('./routes/email');
const authorizeRouter = require('./routes/authorize');
const callRouter = require('./routes/call');
const enrollRouter = require('./routes/enroll');
const createEnrollmentRouter = require('./routes/create-enrollment');
const submitToDatabaseRouter = require('./routes/submit');

const app = express();
global.__appRoot = path.resolve(__dirname);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/email', emailRouter);
app.use('/authorize', authorizeRouter);
app.use('/call', callRouter);
app.use('/enroll', enrollRouter);
app.use('/register', createEnrollmentRouter);
app.use('/submit', submitToDatabaseRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

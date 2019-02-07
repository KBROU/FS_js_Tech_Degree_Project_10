//Kody Broussard
//Jan 6th 2019
//FS_js_Tech_Degree_Project_10
//A Library Manager Build with Express, Node.js, and NPM Sequelize

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const favicon = require('serve-favicon');
const connect = require('connect');
const methodOverride = require('method-override');

//Setting route variables
const indexRouter = require('./routes/index');
const bookRouter = require('./routes/books');
const loanRouter = require('./routes/loans');
const patronRouter = require('./routes/patrons');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(methodOverride('_method'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Setting up route paths
app.use('/', indexRouter);
app.use('/books', bookRouter);
app.use('/loans', loanRouter);
app.use('/patrons', patronRouter);

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

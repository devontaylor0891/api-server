var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hike = require('./routes/hike');
var routes = require('./routes');
var schedule = require('node-schedule');
var scheduledTask = require('./src/handlers/scheduledTasks/scheduledTasks.2');

var rule = new schedule.RecurrenceRule();
// rule.second = [0,10,15,30,45];
// rule.hour = [0,12];
rule.minute = [27];
// rule.second = [22];

console.log('rule: ', rule);

var j = schedule.scheduleJob(rule, scheduledTask.test_function);
// var j = schedule.scheduleJob(rule, function(){
//   console.log('The answer to life, the universe, and everything!');
// });

var app = express();

app.use(cors());

app.use(bodyParser.json());

app.use('/api', routes);

// // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// // app.use(express.static(path.join(__dirname, 'public')));

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

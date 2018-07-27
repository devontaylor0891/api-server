var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var hike = require('./routes/hike');
var routes = require('./routes');

var app = express();

var allowCrossDomain = function(req, res, next) {
  if ('OPTIONS' == req.method) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(200);
  }
  else {
    next();
  }
};

app.use(allowCrossDomain);

// let corsOptions = {
//   "origin": "*",
//   "credentials": true,
//   "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
//   "preflightContinue": false,
//   "optionsSuccessStatus": 204
// };

// app.options('*', cors());

// app.all('/', function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Credentials', true)
//   res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PATCH, PUT, DELETE')
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
//   if (req.method === 'OPTIONS') {
//     res.send(200)
//   } else {
//     next()
//   }
// })

app.use(bodyParser.json({ type: 'application/json' }));

// app.all('/', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next();
//  });
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use('/api', routes);

// app.get('/hikes', hike.index);
// app.post('/add_hike', hike.add_hike);

// // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// // app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

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

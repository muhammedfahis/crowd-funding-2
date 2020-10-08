var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose=require('mongoose');
var upload=require('express-fileupload');
var session= require('express-session');
var bodyParser= require('body-parser');

var router =express.Router();



var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');



var app = express();
app.use(router)

app.set('etag', false);

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})



mongoose.connect('mongodb://localhost/mydb',
                 { useUnifiedTopology: true ,useNewUrlParser: true},);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// app.use(logger('dev'));

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: false}));
// app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use('/admin', adminRouter);
app.use('/', usersRouter);




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

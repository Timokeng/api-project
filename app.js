var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testRouter = require('./routes/test')

// import router
var posts = require('./routes/posts');
var post = require('./routes/post');
var theme = require('./routes/theme')
var topList = require('./routes/topList');
var createAccount = require('./routes/createAccount');
var token = require('./routes/token');
var mineCollect = require('./routes/mineCollect');
var minePost = require('./routes/minePost');
var imageRouter = require('./routes/image');
var commit = require('./routes/commit');
var deleteRouter = require('./routes/delete');
var collect = require('./routes/collect');
var like = require('./routes/like');
var review = require('./routes/review');
var searchRouter = require('./routes/search');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/test', testRouter);

// 设置跨域访问
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");//*表示允许的域名地址，本地则为'http://localhost' 
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Authorization");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  res.header("Cache-Control", "no-store");
  next();
});

app.use('/posts', posts);
app.use('/post', post);
app.use('/theme', theme);
app.use('/topList', topList);
app.use('/createAccount', createAccount);
app.use('/token', token);
app.use('/mineCollect', mineCollect);
app.use('/minePost', minePost);
app.use('/image', imageRouter);
app.use('/commit', commit);
app.use('/delete', deleteRouter);
app.use('/collect', collect);
app.use('/like', like);
app.use('/review', review);
app.use('/search', searchRouter);

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

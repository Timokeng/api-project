var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var base = require('./base')

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
var top = require('./routes/top');

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

app.use('/token', token);

// 设置全局变量，通过token做鉴权，提出当前用户信息并设置为全局变量
app.use(base.getCurUserInfo);

app.use('/posts', posts);// 完成
app.use('/post', post);// 完成
app.use('/theme', theme);// 完成
app.use('/topList', topList);// 完成
app.use('/createAccount', createAccount);// 完成
app.use('/mineCollect', mineCollect);// 完成
app.use('/minePost', minePost);// 完成
app.use('/image', imageRouter);// 完成
app.use('/commit', commit);// 完成
app.use('/delete', deleteRouter);// 完成
app.use('/collect', collect);// 完成
app.use('/like', like);// 完成
app.use('/review', review);// 完成
app.use('/top', top);// 完成
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
  res.send(err);
});

module.exports = app;

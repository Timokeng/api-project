var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var URL = require('url');
var base = require('../base.js')

// 创建连接
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'forum'
});
connection.connect();

// 构造sql语句
var sql = 'INSERT INTO posts(userId,title,message,images,likeNumber,lastModified) VALUE(?,?,?,?,0,?)';
var changeSql = 'UPDATE posts SET title=?,message=?,images=? WHERE id=?';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(404);
  res.send();
});

/* POST user listing */
router.post('/', function(req, res, next) {
  var data = req.body;
  var timestamp = new Date();
  var images = JSON.stringify(data.post.imageList);
  if(!data.id){ // 发帖
    let sqlParams = [global.userInfo.id, data.post.title, data.post.message, images, timestamp]
    connection.query(sql, sqlParams, function(err, result){
      if(err){
        base.sendErr(res, 2, err);
      } else{
        res.send({
          code: 0,
          data: {
            message: '发帖成功'
          }
        });
      }
    })
  } else{ // 修改帖子
    let sqlParams = [data.post.title, data.post.message, images, data.id];
    connection.query(changeSql, sqlParams, function(err, result){
      if(err){
        base.sendErr(res, 2, err);
      } else{
        res.send({
          code: 0,
          data: {
            message: '修改帖子成功'
          }
        })
      }
    })
  }
})

module.exports = router;

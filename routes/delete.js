var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var URL = require('url');
var base = require('../base.js');

// 创建连接
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'forum'
});
connection.connect();

// 构造sql语句
var sql = 'DELETE FROM posts WHERE id=?';
var deleteTopSql = 'DELETE FROM top WHERE postId=?'

/* GET users listing. */
router.get('/', function(req, res, next) {
  var params = URL.parse(req.url, true).query;
  if(params.id < 1 || !params.id){
    base.sendErr(res, 1);
    return;
  }
  // 删除帖子主体
  connection.query(sql, [params.id], function(err, result){
    if(err){
      base.sendErr(res, 2, err);
    } else{
      connection.query(deleteTopSql, [params.id], function(err){
        res.send({
          code: 0,
          data: {
            message: '删帖成功'
          }
        })
      })
    }
  })
});

module.exports = router;

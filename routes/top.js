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
var topSql = 'INSERT INTO top(postId) VALUE(?)';
var unTopSql = 'DELETE FROM top WHERE postId=?';

/* GET users listing. */
router.get('/', function(req, res, next) {
  var params = URL.parse(req.url, true).query;
  console.log(params);
  if(!params || !params.id || params.top === undefined){
    base.sendErr(res, 1);
  } else{
    if(params.top == 1){
      connection.query(unTopSql, [params.id], function(err, result){
        if(err){
          base.sendErr(res, 2, err);
        } else{
          res.send({
            code: 0,
            data: {
              message: '已取消置顶'
            }
          })
        }
      })
    } else{
      connection.query(topSql, [params.id], function(err, result){
        if(err){
          base.sendErr(res, 2, err);
        } else{
          res.send({
            code: 0,
            data: {
              message: '置顶成功'
            }
          })
        }
      })
    }
  }
});

module.exports = router;

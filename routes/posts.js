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
var sql = 'SELECT * FROM posts ORDER BY lastModified desc';

/* GET users listing. */
router.get('/', function(req, res, next) {
  var params = URL.parse(req.url, true).query;
  // 参数错误返回结果
  if(params.page < 1 || !params.page){
    base.sendErr(res, 1);
    return;
  }
  // 正常数据库数据提取和返回流程
  connection.query(sql, function(err, result){
    if(err){
      base.sendErr(res, 2, err);
      return;
    }
    var list = result.slice((params.page - 1) * 10, (params.page * 10));
    if(list.length){
      res.send({
        code: 0,
        data: {
          list: list
        }
      });
    } else{
      base.sendErr(res, 3);
    }
  })
});

module.exports = router;

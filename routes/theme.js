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
var sql = 'SElECT title,message,images FROM posts WHERE id=?'

/* GET users listing. */
router.get('/', function(req, res, next) {
  var params = URL.parse(req.url, true).query;
  if(!params.id){
    base.sendErr(res, 1);
  } else{
    connection.query(sql, [params.id], function(err, result){
      if(err){
        base.sendErr(res, 2, err);
      } else{
        if(result.length){
          res.send({
            code: 0,
            data: {
              title: result[0].title,
              message: result[0].message,
              imageList: result[0].images
            }
          })
        } else{
          base.sendErr(res, 3);
        }
      }
    })
  }
});

module.exports = router;

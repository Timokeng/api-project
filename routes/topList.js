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
var sql = 'SELECT * FROM top';
var getPostDetailSql = 'SELECT title FROM posts WHERE id=?'

// 数据获取方法（Promise）
// ==获取置顶列表
function getTopList(res){
  return new Promise(function(resolve, reject){
    connection.query(sql, function(err, result){
      if(err){
        base.sendErr(res, 2, err);
        reject();
      } else{
        if(result.length){
          resolve(result);
        } else{
          base.sendErr(res, 3);
          reject();
        }
      }
    })
  })
}
// ==获取帖子详情（暂时只有标题）
function getPostDetail(id, res){
  return new Promise(function(resolve, reject){
    connection.query(getPostDetailSql, [id], function(err, result){
      if(err){
        base.sendErr(res, 2, err);
        reject()
      } else{
        if(result.length){
          var data = {
            id: id,
            title: result[0].title
          }
          resolve(data);
        } else{
          base.sendErr(res, 3);
          reject();
        }
      }
    })
  })
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  getTopList(res).then(function(result){
    var list = [];
    for(let i = 0; i < result.length; i++){
      list.push(getPostDetail(result[i].postId, res));
    }
    return new Promise(function(resolve, reject){
      Promise.all(list).then(function(resu){
        resolve(resu);
      })
    })
  }).then(function(result){
    res.send({
      code: 0,
      data: {
        list: result
      }
    });
  })
});

module.exports = router;

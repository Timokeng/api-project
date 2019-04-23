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
var judgeIfCollectSql = 'SELECT * FROM collect WHERE postId=?';
var collectSql = 'INSERT INTO collect(userId,postId) VALUE(?,?)'
var unCollectSql = 'DELETE FROM collect WHERE postId=?'

// 数据获取方法（Promise）
// ==判断是否收藏
function judgeIfCollect(id){
  return new Promise(function(resolve, reject){
    connection.query(judgeIfCollectSql, [id], function(err, result){
      if(err){
        reject(err);
      } else{
        if(result.length){
          resolve(true);
        } else{
          resolve(false);
        }
      }
    })
  })
}

// ==收藏帖子
function collect(userId, postId){
  return new Promise(function(resolve, reject){
    connection.query(collectSql, [userId,postId], function(err, result){
      if(err){
        reject(err);
      } else{
        resolve('收藏成功');
      }
    })
  })
}

// ==取消收藏
function unCollect(postId){
  return new Promise(function(resolve, reject){
    connection.query(unCollectSql, [postId], function(err, result){
      if(err){
        reject(err);
      } else{
        resolve('已取消收藏');
      }
    })
  })
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  var params = URL.parse(req.url, true).query;
  if(params.id < 1 || !params.id){
    base.sendErr(res, 1);
  } else{
    judgeIfCollect(params.id).then(function(result){
      if(result){
        return unCollect(params.id);
      } else{
        return collect(global.userInfo.id, params.id);
      }
    }).then(function(result){
      res.send({
        code: 0,
        data: {
          message: result
        }
      })
    }).catch(function(err){
      base.sendErr(res, 2, err);
    })
  }
});

module.exports = router;

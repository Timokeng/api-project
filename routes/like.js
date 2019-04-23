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
var judgeIfLikeSql = 'SELECT * FROM likes WHERE postId=?';
var likeSql = 'INSERT INTO likes(userId,postId) VALUE(?,?)';
var unLikeSql = 'DELETE FROM likes WHERE postId=?';
var getLikeNumberSql = 'SELECT likeNumber FROM posts WHERE id=?';
var changeLikeNumberSql = 'UPDATE posts SET likeNumber=? WHERE id=?';

// 数据获取方法（Promise）
// ==判断是否收藏
function judgeIfLike(id){
  return new Promise(function(resolve, reject){
    connection.query(judgeIfLikeSql, [id], function(err, result){
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
function like(userId, postId){
  return new Promise(function(resolve, reject){
    connection.query(likeSql, [userId,postId], function(err, result){
      if(err){
        reject(err);
      } else{
        resolve('点赞成功');
      }
    })
  })
}

// ==取消收藏
function unLike(postId){
  return new Promise(function(resolve, reject){
    connection.query(unLikeSql, [postId], function(err, result){
      if(err){
        reject(err);
      } else{
        resolve('已取消点赞');
      }
    })
  })
}

// ==修改点赞数
function changeLikeNumber(id, act){
  connection.query(getLikeNumberSql, [id], function(err, result){
    if(err){
      console.log(err);
    } else{
      var likeNumber = Number(result[0].likeNumber);
      if(act){
        likeNumber--;
      } else{
        likeNumber++;
      }
      connection.query(changeLikeNumberSql, [likeNumber,id], function(err, result){
        if(err){
          console.log(err);
        }
      })
    }
  })
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  var params = URL.parse(req.url, true).query;
  if(params.id < 1 || !params.id){
    base.sendErr(res, 1);
  } else{
    judgeIfLike(params.id).then(function(result){
      changeLikeNumber(params.id, result);
      if(result){
        return unLike(params.id);
      } else{
        return like(global.userInfo.id, params.id);
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

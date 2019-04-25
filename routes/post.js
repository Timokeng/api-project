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
var getPostInfoSql = 'SELECT * FROM posts WHERE id=?';
var getUserInfoSql = 'SELECT * FROM user_info WHERE id=?';
var ifLikeSql = 'SELECT * FROM likes WHERE userId=? AND postId=?';
var ifCollectSql = 'SELECT * FROM collect WHERE userId=? AND postId=?';
var getReplySql = 'SELECT * FROM reply1 WHERE parentId=?';
var getChildReplySql = 'SELECT * FROM reply2 WHERE parentId=?';

// 数据获取方法（Promise）
// ==获取帖子信息
function getPostInfo(data, res){
  return new Promise(function(resolve, reject){
    connection.query(getPostInfoSql, [data.id], function(err, result){
      if(err){
        base.sendErr(res, 2, err);
        reject();
      } else{
        if(result.length){
          data.postInfo = result[0];
          resolve(data);
        } else{
          base.sendErr(res, 3);
          reject();
        }
      }
    });
  })
}
// ==获取用户信息
function getUserInfo(data, res){
  return new Promise(function(resolve, reject){
    connection.query(getUserInfoSql, [data.postInfo.userId], function(err, result){
      if(err){
        base.sendErr(res, 2, err);
        reject();
      } else{
        if(result.length){
          data.userInfo = result[0];
          resolve(data);
        } else{
          base.sendErr(res, 3);
          reject();
        }
      }
    })
  })
}
// ==获取回复信息
function getReply(data, res){
  return new Promise(function(resolve, reject){
    connection.query(getReplySql, [data.id], function(err, result){
      if(err){
        base.sendErr(res, 2, err);
        reject();
      } else{
        result = result.slice((data.page - 1) * 10, data.page * 10);
        if(result.length || data.page == 1){
          data.reply = result;
          resolve(data);
        } else{
          base.sendErr(res, 3);
          reject();
        }
      }
    })
  })
}
// ==获取子回复信息
function getChildReply(id, res){
  return new Promise(function(resolve, reject){
    connection.query(getChildReplySql, [id], function(err,result){
      if(err){
        base.sendErr(res, 2, err);
        reject();
      } else{
        resolve(result);
      }
    })
  })
}

// ==判断当前用户是否收藏
function judgeCollect(postId, userId, res){
  return new Promise(function(resolve, reject){
    connection.query(ifCollectSql, [userId, postId], function(err,result){
      if(err){
        base.sendErr(res, 2, err);
        reject();
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

// ==判断当前用户是否点赞
function judgeLike(postId, userId, res){
  return new Promise(function(resolve, reject){
    connection.query(ifLikeSql, [userId, postId], function(err,result){
      if(err){
        base.sendErr(res, 2, err);
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

/* GET users listing. */
router.get('/', function(req, res, next) {
  var params = URL.parse(req.url, true).query;
  // 参数错误
  if(params.page < 1 || !params.page || params.id < 1 || !params.id){
    base.sendErr(res, 1);
  } else{
    if(params.page == 1){
      /**
       * 由于各个表联系才能组成完整的接口返回信息
       * 这里我使用Promise整理其关系
       * 逻辑上是分步获取帖子信息、用户信息、回复信息、子回复信息、是否收藏/点赞  
       * */ 
      getPostInfo(params, res).then(function(result){
        return getUserInfo(result ,res);
      }).then(function(result){
        return getReply(result, res);
      }).then(function(result){
        let list = [];
        for(let i = 0; i < result.reply.length; i++){
          list.push(getChildReply(result.reply[i].id, res));
        }
        return new Promise(function(resolve, reject){
          Promise.all(list).then(function(resu){
            for(let i = 0; i < result.reply.length; i++){       
              result.reply[i].children = resu[i];
            }
            resolve(result);
          })
        })
      }).then(function(result){
        var ifCol = judgeCollect(result.postInfo.id, global.userInfo.id, res);
        var ifLi = judgeLike(result.postInfo.id, global.userInfo.id, res);
        return new Promise(function(resolve, reject){
          Promise.all([ifCol, ifLi]).then(function(resu){
            result.collect = resu[0];
            result.like = resu[1];
            resolve(result);
          })
        })
      }).then(function(result){
        let imageList = JSON.parse(result.postInfo.images);
        var data = {
          id: result.postInfo.id,
          title: result.postInfo.title,
          author: result.userInfo.nickName,
          userImg: result.userInfo.avatarUrl,
          message: result.postInfo.message,
          imageList: imageList,
          collect: result.collect,
          like: result.like,
          reply: result.reply
        }
        res.send({
          code: 0,
          data: data
        })
      }).catch(function(err){
        console.log(err);
      })
    } else{
      // page不为1，即翻页请求，就只需要提取reply数据
      getReply(params, res).then(function(result){
        let list = [];
        for(let i = 0; i < result.reply.length; i++){
          list.push(getChildReply(result.reply[i].id, res));
        }
        return new Promise(function(resolve, reject){
          Promise.all(list).then(function(resu){
            for(let i = 0; i < result.reply.length; i++){       
              result.reply[i].children = resu[i];
            }
            resolve(result);
          })
        })
      }).then(function(result){
        console.log(result);
        var data = {
          reply: result.reply
        };
        res.send({
          code: 0,
          data: data
        });
      }).catch((err)=>{
        
      })
    }
  }
});

module.exports = router;

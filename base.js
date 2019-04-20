function sendErr(res, code, err){
    if(code == 1){
      res.send({
        code: 1,
        data: {
          message: '参数错误'
        }
      });
      return;
    }
    if(code == 2){
      res.send({
        code: 2,
        data: {
          message: err.message
        }
      });
      return;
    }
    if(code == 3){
      res.send({
        code: 3,
        data: {
          message: '已无更多数据'
        }
      });
      return;
    }
  }

  module.exports = {
      sendErr
  }
var express = require('express');
var multer = require('multer');
var router = express.Router();
 
var storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './public/images')  //这里是图片存储路劲
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + file.originalname)
    }
});
var upload = multer({
    storage: storage
});
 
router.use('/', upload.single('file'), function (req, res, next) {
  console.log(req.file)
  var url = 'http://' + req.headers.host + '/images/' + req.file.filename;
  res.send({
    code: 0,
    data: {
      imageUrl: url
    }
  })
});
 
module.exports = router;
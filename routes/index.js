var express = require('express');
var router = express.Router();
// var UserModel=require('../db/models').UserModel
var {UserModel}=require('../db/models')
var md5=require('blueimp-md5')
const filter={password:0,_v:0}//指定过滤的属性
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 注册一个路由：用户注册
// a) path 为: /register
// b) 请求方式为: POST
// c) 接收 username 和 password 参数
// d) admin 是已注册用户
// e) 注册成功返回: {code: 0, data: {_id: 'abc', username: ‘xxx’, password:’123’}
// f) 注册失败返回: {code: 1, msg: '此用户已存在'}
// router.post('/register',function (req,res) {//get:query(路径带的参数)/param(问号带的参数) post:body
//   // 1.获取请求参数
//   const {username,password}=req.body;
//   // 2.处理
//   if(username=='admin'){//注册失败
//     // 3.返回响应数据
//     res.send({code:1,msg:'此用户已存在'})
//   }else{//注册成功
//     // 3.返回响应数据
//     res.send({code:0,data:{id:'123',username,password}})
//   }
// });

// 注册
router.post('/register',function (req,res) {
  // 1.获取请求参数
  const {username,password,type}=req.body;
  // 2.处理 判断用户是否存在,如果存在则提示错误信息,如果不存在则保存
  UserModel.findOne({username},function (err,user) {
    if(user){
      res.send({code:1,msg:'此用户已存在'})//// 3.返回响应数据
    }else{
      new UserModel({username,password:md5(password),type}).save(function (err,user) {
        // 生成一个 cookie(userid: user._id), 并交给浏览器保存  持久化 cookie, 浏览器会保存在本地文件
        res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7})
        const data={username,type,_id:user._id}
        res.send({code:0,data})//// 3.返回响应数据
      })
    }
  })

  
})
// 登录
router.post('/login',function (req,res) {
  const {username,password}=req.body
  // 查询用户名和密码是否存在于数据库，如果没有返回提示错误的信息，如果有返回登录成功信息
  UserModel.findOne({username,password:md5(password)},filter,function (err,user) {
    if(user){//登录成功
      res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7})
      res.send({code:0,data:user})
    }else{//登录失败
      res.send({code:1,msg:'用户名或密码不正确!'})
    }
  })
})
// 更新用户信息
router.post('/update',function (req,res) {
  // 得到请求 cookie 的 userid,cookie发送请求的时候由浏览器携带过来
  const userid = req.cookies.userid
  // 如果cookie 的 userid不存在，直接返回一个提示信息
  if(!userid){
    return res.send({code:1,msg:'请先登录!'})
  }
  // 如果cookie 的 userid存在，根据userid更新对应的文档数据
  const user=req.body
  UserModel.findByIdAndUpdate({_id:userid},user,function (error,oldUser) {
    if(!oldUser){//cookie如果有问题,删除cookie
      res.clearCookie('userid')
      res.send({code:1,msg:'请先登录!'})
    }else{
      // 准备返回的user数据对象
      const {_id,username,type}=oldUser
      const data = Object.assign(user, {_id, username, type})
      res.send({code:0,data})
    }
  })
})
// 获取用户信息
router.get('/user',function (req,res) {
  const userid = req.cookies.userid
  // 如果cookie 的 userid不存在，直接返回一个提示信息
  if(!userid){
    return res.send({code:1,msg:'请先登录!'})
  }
  UserModel.findOne({_id:userid},filter,function (err,user) {
    if(!user._id){
      res.clearCookie('userid')
      res.send({code:1,msg:'请先登录!'})
      return
    }
    res.send({code:0,data:user})
  })
})
// 获取指定用户列表
router.get('/userlist',function (req,res) {
  const {type}=req.query
  UserModel.find({type:type},function (err,users) {
    res.send({code:0,data:users})
  })
})
module.exports = router;

const md5=require('blueimp-md5')
// 1. 连接数据库
// 1.1. 引入 mongoose
const mongoose = require('mongoose')
// 1.2. 连接指定数据库(URL 只有数据库是变化的)
mongoose.connect('mongodb://localhost:27017/gz_test2')
// 1.3. 获取连接对象
const conn = mongoose.connection
// 1.4. 绑定连接完成的监听(用来提示连接成功)
conn.on('connected', function () {
    console.log('数据库连接成功')
})
// 2.得到对应特定集合的 Model
// 2.1. 字义 Schema(描述文档结构)
const userSchema=mongoose.Schema({
    username: {type: String, required: true}, // 用户名
    password: {type: String, required: true}, // 密码
    type: {type: String, required: true}, // 用户类型: dashen/laoban
    header:{type:String}
})
// 2.2. 定义 Model(与集合对应, 可以操作集合)
const UserModel=mongoose.model('user',userSchema)
// 3. 通过 Model 或其实例对集合数据进行 CRUD 操作
// 3.1. 通过 Model 实例的 save()添加数据
function testSave() {
    // 通过实例save()添加数据
    const userModel=new UserModel({username:'殇不患',password: md5('123'),type:'laoban'})
    userModel.save(function (error,user) {
        console.log('save()',error,user)
    })
}
// testSave()
// 3.2. 通过 Model 的 find()/findOne()查询多个或一个数据
function testFind() {
    // 通过Model查询数据
    UserModel.find(function (error,users) {
        console.log('find()',error,users)
    })
    UserModel.findOne({_id: '5ca09f199cfa1816043dab12'},function (error,user) {
        console.log('findOne()',error,user)
    })
}
// testFind()
// 3.3. 通过 Model 的 findByIdAndUpdate()更新某个数据
function testUpData() {
    UserModel.findByIdAndUpdate({_id:'5ca09e0474fc1d0a80359586'},{username:'殇不患'},function (error,user) {
        console.log('findByIdAndUpdate()',error,user)
    })
}
// testUpData()
// 3.4. 通过 Model 的 remove()删除匹配的数据
function testDelete() {
    UserModel.remove({_id:'5ca09effe8898f2aac0e32c0'},function (error,user) {
        console.log('remove()',error,user)
    })
}
testDelete()
/*包含 n 个能操作 mongodb 数据库集合的 model 的模块
1. 连接数据库
1.1. 引入 mongoose
1.2. 连接指定数据库(URL 只有数据库是变化的)
1.3. 获取连接对象
1.4. 绑定连接完成的监听(用来提示连接成功)
2. 定义出对应特定集合的 Model 并向外暴露
2.1. 字义 Schema(描述文档结构)
2.2. 定义 Model(与集合对应, 可以操作集合)
2.3. 向外暴露 Model
*/
var mongoose=require('mongoose')
mongoose.connect('mongodb://localhost:27017/gz_test3')
mongoose.connection.once('open',()=>{
    console.log('db connect success!')
})
const userSchema=mongoose.Schema({
    username: {type: String, required: true}, // 用户名
    password: {type: String, required: true}, // 密码
    type: {type: String, required: true}, // 用户类型: dashen/laoban
    header: {type: String}, // 头像名称
    post: {type: String}, // 职位
    info: {type: String}, // 个人或职位简介
    company: {type: String}, // 公司名称
    salary: {type: String} // 工资
})
const UserModel=mongoose.model('user',userSchema)
// module.exports=xxx
exports.UserModel=UserModel
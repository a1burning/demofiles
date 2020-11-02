// 基础模块的index.js
// 导入模块成员
import { log } from './logger'
import message from './message'

// 使用模块成员
const msg = message.hi

log(msg)


// __________________________________

// 多入口打包的index.js
// 使用的时候把上面注释，开启下面的注释

// import fetchApi from './fetch'
// import { log } from './logger'

// fetchApi('/posts').then(data => {
//   data.forEach(item => {
//     log(item)
//   })
// })

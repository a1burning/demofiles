#!/usr/bin/env node

// 导入两个模块
const path = require('path')
// 导入stream模块
const { Readable } = require('stream')
const Koa = require('koa')
const send = require('koa-send')
const compilerSFC = require('@vue/compiler-sfc')

// 创建Koa的实例
const app = new Koa()

// 把流转换成字符串，参数是流ctx.body
// 返回一个promise对象
const steamToString = stream => new Promise((resolve, reject) => {
  // 定义一个数组，存储Buffer
  const chunks = []
  // data事件，把数据存储到数组中
  stream.on('data', chunk => chunks.push(chunk))
  // end事件数据读取完毕之后，把数据和chunks合并并转换成字符串，通过resolve返回
  stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
  stream.on('error',reject)
})

// 把字符串转换成流，接收参数text是字符串
const stringToStream = text => {
  // 创建Readable对象
  const stream = new Readable()
  // 字符串添加到stream中
  stream.push(text)
  // 表示流写完了
  stream.push(null)
  // 将stream返回
  return stream
}

// 3. 这里在处理静态文件之前，加载第三方模块
app.use(async (ctx, next) => {
  // ctx.path --> /@modules/vue
  // 判断path是否以 /@modules/ 开头
  if(ctx.path.startsWith('/@modules/')) {
    // 拿到模块名称，直接把前面10个字符截取
    const moduleName = ctx.path.substr(10)
    // 思路：
    // 获取ES Module模块的入口文件，先找到这个模块的package.json，然后再获取package.json的ES Module模块的入口
    
    // 拼接package.json的路径
    const pkgPath = path.join(process.cwd(), 'node_modules', moduleName, 'package.json')
    // 加载package.json
    const pkg = require(pkgPath)
    // 重新给ctx.path赋值，拼接入口文件
    ctx.path = path.join('/node_modules', moduleName, pkg.module)
  }
  // 执行下一个中间件
  await next()
})

// 1. 开启静态文件服务器
// 创建中间件
app.use(async (ctx, next) => {
  // 通过send把index.html返回给浏览器
  // ctx 上下文，ctx.path 当前请求的路径，root 根目录(当前运行程序的目录)，index 默认页面
  await send(ctx, ctx.path, { root: process.cwd(), index: 'index.html' })
  // 执行下一个中间件
  await next()
})

// 4. 处理单文件组件
app.use(async (ctx, next) => {
  // 判断是否是单文件组件
  if (ctx.path.endsWith('.vue')) {
    // 让ctx.body转换成字符串
    const contents = await steamToString(ctx.body)
    // 通过compilerSFC的parse方法返回编译之后的结果
    // 返回两个元素，descriptor 单文件组件的描述对象，errors 编译过程中的错误
    const { descriptor } = compilerSFC.parse(contents)
    // 定义code，最后返回给浏览器的数据
    let code
    // 处理第一次请求，没有type属性
    if (!ctx.query.type) {
      // 获取得到的内容
      code = descriptor.script.content
      // 把export default 要进行替换，并把后面的内容进行拼接
      code = code.replace(/export\s+default\s+/g, 'const __script = ')
      // 单文件组件的路径是ctx.path
      code += `
      import { render as __render } from "${ctx.path}?type=template"
      __script.render = __render
      export default __script
      `
    // 第二次请求，判断type是否是template
    } else if (ctx.query.type === 'template') {
      // compilerSFC 有一个编译模板的方法 compileTemplate
      // compileTemplate 接收一个参数对象，source是模板内容，descriptor.template.content就是模板内容
      const templateRender = compilerSFC.compileTemplate({ source: descriptor.template.content })
      // 返回值的code属性就是render函数
      code = templateRender.code
    }
    // 设置请求contentType是js类型的文件
    ctx.type = 'application/javascript'
    // 将code转换成只读流给body
    ctx.body = stringToStream(code)
  }
  // 处理下一个中间件
  await next()
})

// 2. 修改第三方模块的路径
app.use(async (ctx, next) => {
  // 判断当前返回给浏览器的文件是不是js，判断其contentType是不是js
  if (ctx.type === 'application/javascript') {
    // 将body转换成字符串
    const contents = await steamToString(ctx.body)
    // 案例：
    // import vue from 'vue' 不能正常加载
    // import App from './App.vue' 可以正常加载
    // import { render as __render } from "/src/App.vue?type=template" 可以正常加载

    // g是全局匹配，()是分组，前一个匹配 from ' 或者 from " \s+是空格的意思
    // 第二个匹配?!的作用是不匹配分组的结果，中括号这里表示不匹配 . 开头的情况或者 / 开头的情况 
    // $1就是第一个分组的结果，后面加上添加的东西
    // 最后的结果就是import vue from '/@modules/vue'
    ctx.body = contents
    .replace(/(from\s+['"])(?![\.\/])/g, '$1/@modules/')
    .replace(/process\.env\.NODE_ENV/g, '"development"')
  }
})

// 监听端口
app.listen(3000)
// 打印提示
console.log('Server running @ http://localhost:3000')
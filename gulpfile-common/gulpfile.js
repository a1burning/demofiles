const { src, dest, parallel, series, watch } = require('gulp')
// 引入清除文件模块
const del = require('del')
const LessAutoprefix = require('less-plugin-autoprefix')
const browserSync = require('browser-sync')

const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()

// 使用create方法会自动创建一个开发服务器
const bs = browserSync.create()
const autoprefix = new LessAutoprefix({browsers: ["last 2 versions"]});

const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Features',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        {
          name: 'Twitter',
          link: 'https://twitter.com/w_zce'
        },
        {
          name: 'About',
          link: 'https://weibo.com/zceme'
        },
        {
          name: 'divider'
        },
        {
          name: 'About',
          link: 'https://github.com/zce'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}

// 创建清除文件任务
const clean = () => {
  // 每次执行的时候，先把之前的dist目录删除，再删除临时目录temp
  return del(['dist', 'temp'])
}

// 创建sass任务
const style = () => {
  // 输入scss的文件路径，并且指定根目录是src，在dist输出目录中，以src目录的结构输出
  return src('src/assets/styles/*.scss', { base: 'src'})
    // 进行sass向css转换，并且指定的样式是完全展开
    // (如果不设置完全展开，那么默认css样式的右花括号不折行)
    .pipe(plugins.sass({ outputStyle: 'expanded' }))
    // 输出到temp临时文件夹
    .pipe(dest('temp'))
    // 以流的方式往浏览器推
    .pipe(bs.reload({ stream: true }))
}

// 创建less任务
const lessStyle = () => {
  return src('src/assets/styles/*.less', { base: 'src'})
  // 进行sass向css转换，并且指定的样式是完全展开
  // (如果不设置完全展开，那么默认css样式的右花括号不折行)
  .pipe(plugins.less({
    plugins: [autoprefix]
  }))
  // 输出到temp临时文件夹
  .pipe(dest('temp'))
  // 以流的方式往浏览器推
  .pipe(bs.reload({ stream: true }))
}


// 创建babel任务
const script = () => {
  return src('src/assets/scripts/*.js', { base: 'src' })
  // 使用babel转换ES6语法
  .pipe(plugins.babel({
    // 插件集合，最新特性的全部打包，不写这个转换没有效果
    presets: ['@babel/preset-env']
  }))
  // 输出到temp临时文件夹
  .pipe(dest('temp'))
  // 以流的方式往浏览器推
  .pipe(bs.reload({ stream: true }))
}

// 创建模板引擎任务
const page = () => {
  // 通配符匹配src下main的所有子目录中的html
  return src('src/**/*.html', { base: 'src' })
    //swig因为模板缓存的关系无法热更新，所以需要默认设置里面关闭缓存
    .pipe(plugins.swig({data, defaults: { cache: false }}))
    // 不需要进行临时文件夹中操作
    .pipe(dest('temp'))
    // 以流的方式往浏览器推
    .pipe(bs.reload({ stream: true }))
}

// 图片压缩任务
const image = () => {
  // 匹配images下面的所有文件
  return src('src/assets/images/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

// 图片压缩任务
const font = () => {
  // 匹配images下面的所有文件
  return src('src/assets/fonts/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

// 将public的任务进行额外输出
const extra = () => {
  return src('public/**', { base: 'pubilc' })
    .pipe(dest('dist'))
}

// 创建服务任务
const serve = () => {
  // 监听文件变化并执行对应任务,写这个就不用写bs.reload()了
  watch('src/assets/styles/*.scss', style)
  watch('src/assets/styles/*.less', lessStyle)
  watch('src/assets/scripts/*.js', script)
  watch('src/**/*.html', page)
  // watch('src/assets/images/**', image)
  // watch('src/assets/fonts/**', font)
  // watch('public/**', extra)
  // 开发阶段不需要每一次修改都压缩文件，这些只是修改的时候重新加载即可
  watch([
    'src/assets/images/**',
    'src/assets/fonts/**',
    'public/**'
  ], bs.reload)
  
  // 进行初始化
  bs.init({
    // 设置开屏右上角链接提示：false去掉
    notify: false,
    // 端口
    port: 2080,
    // 是否会自动打开浏览器:false是关闭
    // open: false,
    // 启动过后监听的文件，如果有修改就主动刷新
    // files: 'temp/*',
    // 核心配置
    server: {
      // 网站根目录,多个的时候写成数组，如果路径找不到会依此去路径中寻找
      // 文件先从temp中寻找
      baseDir: ['temp', 'src', 'public'],
      // 优先于baseDir，会先匹配这个配置，没有就会去baseBir中获取
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
}

const useref = () => {
  // dist当中的所有文件注释，进行打包压缩
  return src('temp/*.html', { base: 'temp' })
    // 文件寻找路径依此进行查找
    .pipe(plugins.useref({ searchPath: ['temp', '.']}))
    // 在这里会生成html js css三种类型的文件，需要对这三种文件进行压缩操作
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    // 不加collapseWhitespace只是压缩一些空格，加上会把这行等空白字符都压缩
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({ 
      collapseWhitespace: true,
      // 行内样式里面的css和js用这个参数可以进行压缩
      minifyCSS: true,
      minifyJS: true
     })))
    // 不要和dist一个目录，边读边写会有问题
    .pipe(dest('dist'))
}

// 执行编译的组合任务
const compile = parallel(style, lessStyle, script, page)
// 生产环境时候的构建任务
/* - 先删除所有的文件夹
   - 下面的东西都可以并行，但是其中应该先编译sass,less,es6,template到temp临时目录，然后再压缩到dist目录
   - 图片、文字和其他的东西可以直接放到dist目录下
*/
const build = series(
  clean, 
  parallel(
    series(compile, useref),
    image, 
    font, 
    extra
    )
  )

// 开发时候的构建任务
// 只需要编译之后发布到本地服务器上即可
const develop = series(compile, serve)

module.exports = {
  clean,
  build,
  develop
}
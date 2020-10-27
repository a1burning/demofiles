const HtmlWebpackPlugin = require('html-webpack-plugin')

// webpack5的模式和4的名称有所不同，这里先用4
const allModes = [
	'eval',
	'cheap-eval-source-map',
	'cheap-module-eval-source-map',
	'eval-source-map',
	'cheap-source-map',
	'cheap-module-source-map',
	'inline-cheap-source-map',
	'inline-cheap-module-source-map',
	'source-map',
	'inline-source-map',
	'hidden-source-map',
	'nosources-source-map'
]

// 将所有的allModes进行遍历，里面的内容都返回一个输出对象
// 这样我们可以同时生成多个不同devtool的尝试
module.exports = allModes.map(item => {
	return {
		// 使用工具就是数组的元素
		devtool: item,
		// 不让webpack对代码做处理
		mode: 'none',
		entry: './src/main.js',
		// 生成的文件都放在js目录下面对应的文件名中
		output: {
			filename: `js/${item}.js`
		},
		module: {
			rules: [
				// 使用babel-loader的目的是我们可以在生成的文件中辨别差异
				{
					test: /\.js$/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env']
						}
					}
				}
			]
		},
		// 为每一个打包任务生成一个html文件
		plugins: [
			new HtmlWebpackPlugin({
				filename: `${item}.html`
			})
		]
	}
})
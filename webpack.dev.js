const merge = require('webpack-merge')
const config = require('config')

const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
	  port: config.get('server.port')
  },
})

const merge = require('webpack-merge')

const common = require('./webpack.common')


module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
	  port: process.env['DOCBAKER_CLIENT_PORT'],
    host: '0.0.0.0'
  },
  watchOptions: {
    poll: true
  }
})

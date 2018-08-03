const ConfigWebpackPlugin = require("config-webpack")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')


module.exports = {
  output: {
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'views': path.resolve(__dirname, './src/views'),
      '~': __dirname
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  plugins: [
    new ConfigWebpackPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html'
    })
  ]
}

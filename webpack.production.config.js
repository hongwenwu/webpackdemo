const webpack = require('webpack');
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
  devtool: 'eval-source-map', // 注意修改了这里，这能大大压缩我们的打包代码

  entry: {
    app: './src' // 已多次提及的唯一入口文件
  },
  output: {
    path: path.resolve(__dirname, './build'), // 打包后的文件存放的地方
    filename: 'bundle-[hash].js' // 打包后输出文件的文件名
  },
  devServer: {
    contentBase: './public', // 本地服务器所加载的页面所在的目录
    historyApiFallback: true, // 不跳转
    inline: true, // 实时刷新
    hot: true
  },
  mode: 'production',
  module: {
    rules: [{
      test: /(\.jsx|\.js)$/,
      use: {
        loader: 'babel-loader'
      },
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      use: [
        devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            modules: true, // 指定启用css modules
            localIdentName: '[name]__[local]--[hash:base64:5]' // 指定css的类名格式
          }
        },
        {
          loader: 'postcss-loader'
        }, {
          loader: 'less-loader'
        }
      ]
    }]
  },
  plugins: [
    new webpack.BannerPlugin('版权所有，翻版必究'),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './src/index.tmpl.html') // new 一个这个插件的实例，并传入相关的参数
    }),
    // new webpack.HotModuleReplacementPlugin()//热加载插件
    new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.optimize.UglifyJsPlugin(),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
    }),
    new CleanWebpackPlugin('build/*.*', {
      root: __dirname,
      verbose: true,
      dry: false
    })
  ],

  optimization: {
    minimizer: [
      // 压缩js
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: false
        }
      }),
      new OptimizeCSSAssetsPlugin({}) //  压缩 css
    ]
  }
};

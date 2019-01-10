const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const devMode = process.env.NODE_ENV !== 'production'

console.log(process.env.NODE_ENV)
module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    app: './src'
  },

  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, './build')
  },
  devServer: {
    // publicPath: '/asset/',
    contentBase: path.join(__dirname, './build'),
    historyApiFallback: true,
    inline: true,
    hot: true,
    compress: true,
    port: 8080,
    host: '0.0.0.0',
    proxy: {
      '^/webapi/**': {
        target: process.env.TARGET || 'http://weixin.app.com',
        changeOrigin: true
      }
    },
    stats: 'errors-only'
  },
  module: {
    rules: [
      {
        test: /(\.jsx|.js)$/,
        use: {
          loader: 'babel-loader'
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: './build'
            }
          }, {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }, {
            loader: 'postcss-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin('build/*.*', {
      root: __dirname,
      verbose: true,
      dry: false
    }),
    new webpack.BannerPlugin('版权声明,翻版必究'),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/src/index.tmpl.html')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css'
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/
        }
      },

      chunks: 'async',
      minChunks: 1,
      minSize: 30000,
      name: true
    }
  },
  performance: {
    hints: false
  }
}

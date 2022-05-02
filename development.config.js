const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const entry = require('./src/lib/fsloader').entry
const htmlTemplate = require('./src/lib/fsloader').htmlTemplateAttribute
module.exports = {
  mode: 'development',
  entry: {
    ...entry,
    index: path.resolve(__dirname, 'src/index.ts'),
  },
  output: {
    filename: '[name]_bundle.js',
    path: __dirname + '/dist',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024, // 4kb
          },
        },
      },
      {
        test: /\.svg$/,
        use: {
          loader: 'svg-url-loader',
          options: {},
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.less', '.js', '.css'],
  },

  // 多数组打包
  plugins: [
    new webpack.DefinePlugin({
      process: {
        template: JSON.stringify(htmlTemplate),
      },
    }),
    ...htmlTemplate.map((val) => {
      return new HtmlWebpackPlugin(val)
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      chunks: ['index'],
    }),
  ],
  devServer: {
    port: 3002,
    host: '0.0.0.0',
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  // https://webpack.docschina.org/configuration/stats/
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
  },
}

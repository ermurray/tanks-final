const merge = require("webpack-merge");
const path = require("path");
const base = require("./base");
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(base, {
  mode: "production",
  output: {
    path: path.resolve(__dirname, "../public"),
    publicPath:"./",
    filename: "bundle.min.js"
  },
  devtool: false,
  performance: {
    maxEntrypointSize: 900000,
    maxAssetSize: 900000
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns:[
        {from: './public/assets', to: 'assets'},
        {from: './public/html', to: 'html'},
        {from: './public/styles', to: 'styles'}
      ]
    })
  ]
});

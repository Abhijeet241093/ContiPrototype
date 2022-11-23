const { merge } = require("webpack-merge");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const Dotenv = require("dotenv-webpack");
const commonConfig = require("./webpack.common");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

const path = require("path");

const appDirectory = path.resolve(__dirname);
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);


const devConfig = {
   mode: "development",
   target: "web",
   devtool: "inline-source-map",
   output: {
      publicPath: "/",
      filename: 'bundle.[hash].js'
   },
   devServer: {
      port: 3000,
      host: "localhost",
      hot: true,
      historyApiFallback: true,
      // open: true,
      proxy:{
         "/api": "http://localhost:9093"
      }
   },

   plugins: [
      new HtmlWebpackPlugin({
         template: "public/index.html",
         favicon: "public/favicon.ico",
      }),
      // new Dotenv(),
      // new CleanWebpackPlugin(),
      // new WorkboxWebpackPlugin.InjectManifest({
      //    swSrc: "./src/src-sw.js",
      //    swDest: "sw.js"
      //  })
   ],
};

module.exports = merge(commonConfig, devConfig);
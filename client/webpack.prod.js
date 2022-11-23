const { merge } = require("webpack-merge");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const commonConfig = require("./webpack.common");
const path = require("path");
const webpack = require("webpack");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");


const prodConfig = {
   entry: "./src/index.js",
   mode: "production",
   devtool: "source-map",
   output: {
      filename: "[name].[hash].js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
      publicPath: '/'
   },
   devServer: {
      historyApiFallback: true,
    },
   plugins: [
      new Dotenv(),
      new HtmlWebPackPlugin({
         template: "./public/index.html",
         favicon: "public/favicon.ico",
         inject: true,
      }),
      // new WorkboxWebpackPlugin.InjectManifest({
      //    swSrc: "./src/src-sw.js",
      //    swDest: "sw.js"
      //  })

   ],
};

module.exports = merge(commonConfig, prodConfig);

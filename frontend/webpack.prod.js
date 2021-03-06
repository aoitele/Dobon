var path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const outputPath = path.resolve(__dirname, "dist");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ASSET_PATH = process.env.ASSET_PATH || "/";

module.exports = {
  mode: 'production',
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, outputPath),
    publicPath: ASSET_PATH,
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          //"vue-style-loader",
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.sass$/,
        use: ["vue-style-loader", "css-loader", "sass-loader?indentedSyntax"],
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            scss: ["vue-style-loader", "css-loader", "sass-loader"],
            sass: [
              "vue-style-loader",
              "css-loader",
              "sass-loader?indentedSyntax",
            ],
          },
          // other vue-loader options go here
        },
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(jpe?g|gif|png|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              // name: "[name].[contenthash].[ext]", //出力するファイル名 extは拡張子
              name: "[name].[ext]", //出力するファイル名 extは拡張子
              outputPath: "images", //output path (dist)からの相対パスを指定
              publicPath: "images", //出力されるCSSからの画像パスを指定
            },
          },
          "image-webpack-loader", //出力される画像を圧縮するためのローダー
        ],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: "index.html",
      chunks: ["app"],
    }),
    new MiniCssExtractPlugin({
      filename: "./css/[name].css", //nameにはエントリーポイント名が入る
    }),
    new CopyPlugin({
      patterns: [{ from: "static" }],
    }),
  ],
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js",
    },
    extensions: ["*", ".js", ".vue", ".json"],
  },
  devtool: 'none',
};


const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true, //Cleans out the build folder
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: "toolchains",
    }),
  ],

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
  //   devtool: "inline-source-map",
  devServer: {
    open: true, // Opens browser automatically
    // static: "./dist",
    // compress: true,
    port: 8000, // Port that listens for requests
  },
};

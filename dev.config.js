const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  entry: {
    index: "./src/index.js", // Base JS entry
  },

  output: {
    path: path.resolve(__dirname, "dist"), // Everything will be put in the dist folder
    filename: "[name].bundle.js", // Entry point bundles will depend on keys in entry object
    clean: true, //Cleans out the build folder before build
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: "DEVELOPMENT Planager",
      favicon: "./src/public/favicon.ico",
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
  devServer: {
    open: true, // Opens browser automatically
    port: 8000, // Port that listens for requests
    // hot: true, // hot module reloading
    proxy: {
      "/socket.io/*": { target: "ws://0.0.0.0:5000", ws: true }, // Proxy any requests to socket.io to the backend
    },
  },
};

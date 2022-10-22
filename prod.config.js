const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",
  devtool: "source-map",
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
      title: "Planager",
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
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    minimize: true,
    minimizer: [new TerserPlugin()],
    chunkIds: "named",
    flagIncludedChunks: true,
  },
};

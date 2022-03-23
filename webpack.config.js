const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = {
  mode: "development",
  entry: path.join(__dirname, "app", "static", "index.js"),
  output: {
    path: path.resolve(__dirname, "app", "static", "dist"),
    filename: "planager.bundle.js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve("babel-loader"),
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
              plugins: ["react-refresh/babel"],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devServer: {
    client: { overlay: true },
    liveReload: false,
    hot: true,
    proxy: { "/": "http://localhost:5000/" },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "app", "static", "index.html"),
    }),
    new ReactRefreshWebpackPlugin(),
  ],
};

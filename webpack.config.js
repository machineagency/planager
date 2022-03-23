const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin"); // eventually this will be integrated into webpack/react, but we use a plugin for now.

module.exports = {
  mode: "development",
  entry: path.join(__dirname, "app", "static", "index.js"), // Top-level JS file
  output: {
    path: path.resolve(__dirname, "app", "static", "dist"),
    filename: "planager.bundle.js", // This bundle is included in the index.html
  },
  resolve: {
    extensions: [".js", ".jsx", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: "html-loader", // Need html loader for the index.html file
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve("babel-loader"),
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"], // Need these presets for transpiling JSX to JS to older JS
              plugins: ["react-refresh/babel"], // This plugin allows for hot reloading of react components
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
    // webpack dev server makes development nice by providing features like hot refreshing of modules
    client: { overlay: true }, // puts webpack errors in an overlay of the browser page
    liveReload: false, // liveReload completely refreshes the page instead of hotswapping, so we turn it off
    hot: true, // turn on hot module reloading
    proxy: { "/": "http://localhost:5000/" }, // Proxied, so any requests go to the backend which is hosted at port 5000
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "app", "static", "index.html"), //
    }),
    new ReactRefreshWebpackPlugin(),
  ],
};

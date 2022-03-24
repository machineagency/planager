const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin"); // eventually this will be integrated into webpack/react, but we use a plugin for now.
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = {
  mode: isDevelopment ? "development" : "production",
  devtool: isDevelopment ? "eval-source-map" : false,
  entry: path.resolve(__dirname, "src", "index.js"), // Top-level JS file
  output: {
    path: path.resolve(__dirname, "src", "dist"),
    filename: "planager.bundle.js", // This bundle is included in the index.html
  },
  resolve: {
    extensions: [".js", ".jsx", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: require.resolve("html-loader"), // Need html loader for the index.html file
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve("babel-loader"),
            options: {
              presets: [
                require.resolve("@babel/preset-env"),
                require.resolve("@babel/preset-react"),
              ], // Need these presets for transpiling JSX to JS to older JS
              plugins: [
                isDevelopment && require.resolve("react-refresh/babel"),
              ].filter(Boolean), // The filter is so we can enable some things only in development mode
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          !isDevelopment && MiniCssExtractPlugin.loader,
          isDevelopment && require.resolve("style-loader"),
          true && require.resolve("css-loader"),
        ].filter(Boolean),
      },
    ],
  },
  devServer: {
    // webpack dev server makes development nice by providing features like hot reloading of modules
    client: { overlay: true, progress: true }, // puts webpack errors in an overlay of the browser page
    liveReload: false, // liveReload completely refreshes the page instead of hot reloading modules, so we turn it off
    hot: true, // turn on hot module reloading
    proxy: { "/": "http://localhost:5000/" }, // Proxied, so any requests go to the backend which is hosted at port 5000
  },
  plugins: [
    !isDevelopment && new MiniCssExtractPlugin(),
    true && // always enabled
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "src", "index.html"),
      }),
    isDevelopment && new ReactRefreshWebpackPlugin(), // Only enabled in development mode
  ].filter(Boolean),
};

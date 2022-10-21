const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js",
    tools: {
      import: [
        "./tools/inputs/color/Color.js",
        "./tools/inputs/slider/Slider.js",
        "./tools/inputs/binary/Binary.js",
      ],
      dependOn: ["index"],
    },
  },

  output: {
    path: path.resolve(__dirname, "dist"), // Everything will be put in the dist folder
    filename: "[name].bundle.js", // Entry point bundles will depend on keys in entry object
    clean: true, //Cleans out the build folder before build
    asyncChunks: true,
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

  devtool: "inline-source-map",
  devServer: {
    open: true, // Opens browser automatically
    static: "./public", // Static assets are served from the public folder
    port: 8000, // Port that listens for requests
    proxy: {
      "/socket.io/*": { target: "ws://0.0.0.0:5000", ws: true }, // Proxy any requests to socket.io to the backend
    },
  },
  // experiments: {
  //   lazyCompilation: true,
  // },
};

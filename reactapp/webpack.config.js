const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require('path');
const Dotenv = require('dotenv-webpack');

const deps = require("./package.json").dependencies;

const printCompilationMessage = require('./compilation.config.js');

module.exports = (_, argv) => ({
  output: {
    publicPath: "http://localhost:3001/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 3001,
    historyApiFallback: true,
    watchFiles: [path.resolve(__dirname, "src")],
    onListening: function (devServer) {
      const port = devServer.server.address().port;

      printCompilationMessage("compiling", port);

      devServer.compiler.hooks.done.tap("OutputMessagePlugin", (stats) => {
        setImmediate(() => {
          if (stats.hasErrors()) {
            printCompilationMessage("failure", port);
          } else {
            printCompilationMessage("success", port);
          }
        });
      });
    },
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "react_remote",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: { "./Button": "./src/Button" },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./public/index.html",
    }),
    new Dotenv(),
  ],
});

// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const { ModuleFederationPlugin } = require("webpack").container
// const path = require("path");

// module.exports = {
//     entry: './src/index.tsx',
//     mode: 'development',
//     output: {
//         publicPath: "http://localhost:3001/",
//         path: path.resolve(__dirname, ".dist")
//     },
//     resolve: {
//         extensions: [".tsx", ".ts", ".js"],
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.jsx?$/, // Transpile JS/JSX files
//                 loader: "babel-loader",
//                 exclude: /node_modules/,
//             },
//             {
//                 test: /\.tsx?$/,
//                 use: "ts-loader",
//                 exclude: /node_modules/,
//             },
//         ],
//     },
//     plugins: [
//         new MiniCssExtractPlugin(),
//         new ModuleFederationPlugin({
//             name: "react_remote",
//             filename: "remoteEntry.js",
//             exposes: {
//                 "./Button": "/src/Button"
//             },
//             shared: { react: { singleton: true, eager: true }, "react-dom": { singleton: true, eager: true } },
//         }),
//         new HtmlWebpackPlugin({
//             template: "./public/index.html",
//         }),
//     ],
//     devServer: {
//         port: 3001,
//         historyApiFallback: true,
//         open: false,
//         hot: true,
//         static: {
//             directory: path.join(__dirname, 'public')
//         }
//     },
// }
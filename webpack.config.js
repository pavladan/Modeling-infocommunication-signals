/* global require module __dirname */

const path = require("path");

const babelTransformClassPlugin = require("@babel/plugin-proposal-class-properties")
  .default;
const CleanWebpackPlugin = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const srcDist = "./src/";
const outputDir = "./dist";

const clean = new CleanWebpackPlugin([outputDir]);
const html = new HtmlWebpackPlugin({
  template: "./public/index.html"
});

module.exports = env => {
  if (!process.env.NODE_ENV) process.env.NODE_ENV = "development";
	const mode = process.env.NODE_ENV;
  const config = {
		devtool: 'source-map',
    mode: mode,
    entry: srcDist + "/index.js",
    resolve: {
      extensions: [".js", ".jsx"]
    },
    module: {
      rules: [
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: {
            loader: "file-loader",
            options: {
              name: "fonts/[name].[ext]",
              publicPath: "../"
            }
          }
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: {
            loader: "file-loader",
            options: {
              name: "icons/[name].[ext]",
              publicPath: "../"
            }
          }
        },
        {
          test: /\.css$/,
          loader: "style-loader!css-loader"
        },
        {
          test: /\.(scss|sass)$/,
          loader: "style-loader!css-loader!sass-loader"
				},
				{
					test: /\.less$/,
					loader: 'style-loader!css-loader!less-loader'
				},
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
							[babelTransformClassPlugin, { loose: true }],
							["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }],
              "@babel/plugin-syntax-dynamic-import"
            ]
          }
        },
        {
          test: /.html$/,
          loader: "html-loader"
        }
      ]
    },
		stats:{
			errorDetails: true,
		},
    plugins: [clean, html],
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, outputDir),
      publicPath: ""
    }
  };
  // if (mode === "production") {
  //   config.plugins.push(
  //     new TerserPlugin({
  //       parallel: true,
  //       terserOptions: {
  //         ecma: 6
  //       }
  //     })
  //   );
  // }
  return config;
};

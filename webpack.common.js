const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: [
        "./src/main.ts"
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'uploads/src'),
        clean: true,
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            { 
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            },
            { 
                test: /\.css$/, 
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.scss$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
        ]
      },

    plugins: [
        new MiniCssExtractPlugin({
            filename:"bundle.css"
        })

    ]
  };
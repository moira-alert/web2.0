const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const config = {
    entry: ['babel-polyfill', 'react-hot-loader/patch', './src/index.js'],
    output: {
        publicPath: '/',
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js',
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)?$/,
                loader: 'babel-loader',
                include: /src/,
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                query: {
                    presets: ['env', 'stage-0', 'react'],
                },
                include: /retail\-ui/,
            },
            {
                test: /\.less$/,
                loaders: ['classnames-loader', 'style-loader', 'css-loader?modules', 'less-loader'],
                include: /src/,
            },
            {
                test: /\.less$/,
                loaders: ['style-loader', 'css-loader', 'less-loader'],
                include: /retail\-ui/,
            },
            {
                test: /\.(png|woff|woff2|eot)$/,
                loader: 'file-loader',
                include: /src|retail\-ui/,
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
                include: /src/,
            },
        ],
    },
    resolve: {
        modules: ['node_modules', 'local_modules'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            favicon: './src/favicon.png',
            inject: 'body',
            minify: {
                collapseWhitespace: true,
            },
        }),
        new webpack.HotModuleReplacementPlugin(),
        new UglifyJSPlugin({
            extractComments: {
                banner: false,
            },
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        hot: true,
        historyApiFallback: true,
    },
};

module.exports = config;

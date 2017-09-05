const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const PROD = process.env.NODE_ENV === 'production';
const config = {
    entry: ['babel-polyfill', 'react-hot-loader/patch', './src/index.js'],
    output: {
        publicPath: '/',
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['env', 'stage-0', 'react'],
                        },
                    },
                ],
                include: /retail\-ui/,
            },
            {
                test: /\.less$/,
                use: PROD
                    ? ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: ['css-loader', 'less-loader'],
                    })
                    : ['style-loader', 'css-loader', 'less-loader'],
                include: /retail\-ui/,
            },
            {
                test: /\.js$/,
                use: ['babel-loader'],
                include: /src/,
            },
            {
                test: /\.less$/,
                rules: [
                    { use: 'classnames-loader' },
                    {
                        use: PROD
                            ? ExtractTextPlugin.extract({
                                fallback: 'style-loader',
                                use: [
                                    {
                                        loader: 'css-loader',
                                        options: {
                                            modules: true,
                                        },
                                    },
                                    'less-loader',
                                ],
                            })
                            : [
                                'style-loader',
                                {
                                    loader: 'css-loader',
                                    options: {
                                        modules: true,
                                    },
                                },
                                'less-loader',
                            ],
                    },
                ],
                include: /src/,
            },
            {
                test: /\.(png|woff|woff2|eot)$/,
                use: 'file-loader',
                include: /src|retail\-ui/,
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
    ],
};

if (PROD) {
    config.plugins.push(new ExtractTextPlugin('app.css'));
    config.plugins.push(new UglifyJSPlugin({ extractComments: { banner: false } }));
}

module.exports = config;

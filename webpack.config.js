const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const config = argv => {
    const PROD = process.env.NODE_ENV === 'production';
    const API_MODE = getApiMode(argv);
    const config = {
        entry: ['babel-polyfill', 'react-hot-loader/patch', './src/index.js'],
        output: {
            publicPath: '/',
            path: path.resolve(__dirname, 'dist'),
            filename: PROD ? 'app.[hash].js' : 'app.js',
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
                    exclude: /node_modules/,
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
                                                localIdentName: '[name]-[local]-[hash:base64:5]',
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
                                            localIdentName: '[name]-[local]-[hash:base64:5]',
                                        },
                                    },
                                    'less-loader',
                                ],
                        },
                    ],
                    exclude: /node_modules/,
                },
                {
                    test: /\.(png|woff|woff2|eot|svg)$/,
                    use: 'file-loader',
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
        devServer: {
            proxy:
                API_MODE === 'fake'
                    ? {
                        '/api': {
                            target: 'http://localhost:9002',
                            pathRewrite: { '^/api': '' },
                        },
                    }
                    : {
                        '/api': {
                            target: 'http://vm-moira-all1:8081',
                            secure: false,
                        },
                    },
        },
    };
    if (PROD) {
        config.plugins.push(new ExtractTextPlugin('app.[hash].css'));
        config.plugins.push(new UglifyJSPlugin({ extractComments: { banner: false } }));
    }
    return config;
};

function getApiMode(argv) {
    for (const arg of argv) {
        if (arg.startsWith('--env.API=')) {
            return arg.substr('--env.API='.length);
        }
    }
    return 'real';
}

module.exports = config(process.argv);

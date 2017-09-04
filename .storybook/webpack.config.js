const path = require('path');

const config = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                loader: 'babel-loader',
                include: /src|retail\-ui/,
                options: {
                    presets: ['env', 'stage-0', 'react'],
                },
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
            },
        ],
    },
    resolve: {
        modules: ['node_modules', 'web_modules', 'local_modules'],
    },
};

module.exports = config;

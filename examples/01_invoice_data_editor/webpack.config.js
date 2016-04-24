var path = require('path');

module.exports = {
    entry: {
        'index': ['regenerator/runtime', './index.js']
    },
    output: {
        path: 'dist',
        publicPath: '/dist/',
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.(c|le)ss$/,
                exclude: /node_modules/,
                loader: 'style-loader!css-loader!less-loader'
            },
            {
                test: /\.(woff|woff2|eot|svg|ttf|gif|png)$/,
                exclude: /node_modules/,
                loader: 'file-loader'
            }
        ]
    },
    resolve: {
        modulesDirectories: ['node_modules', 'local_modules'],
        extensions: ['', '.js', '.jsx'],
        alias: {
            'reelm': 'C:/workspace/local_modules/reelm/src',
            'reelm-formulas': 'C:/workspace/local_modules/reelm-formulas/src'
        }
    }
};
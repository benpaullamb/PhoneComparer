const path = require('path');

module.exports = {
    entry: './src/App.js',
    output: {
        path: path.join(__dirname, './public'),
        filename: 'bundle.js'
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, './public')
    }
};
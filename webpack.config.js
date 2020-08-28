const path = require('path');

module.exports = {
    mode: 'development',
    entry: './intCubes_v2.js',
    devtool: 'eval-source-map',
    output:{
        path: path.resolve(__dirname,'out'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
    }
};
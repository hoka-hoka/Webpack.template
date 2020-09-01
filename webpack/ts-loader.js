const path = require('path');
module.exports = function() {
  return {
    entry: './src/ts/index.ts',
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    // output: {
    //   path: path.join(__dirname, 'src'),
    //   filename: 'index.js'
    // },
    module: {
      rules: [
        { 
          test: /\.tsx?$/, 
          loader: 'awesome-typescript-loader'
        }
      ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
  }
}
  
module.exports = function() {
  return {
    module: { // погрузщики преобразований
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules\/swiper\/svg4everybody/,
          use: ['babel-loader']
        }
      ]
    }
  }
};
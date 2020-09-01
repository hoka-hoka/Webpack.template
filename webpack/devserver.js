const paths = require('../build/webpack.paths.config');

module.exports = function() {
  return {
    devServer: {
      contentBase: paths.PATHS.dist,
      port: 8081,
      overlay: { // вывод ошибок на экране браузера
        warnings: false,
        errors: true
      }
    }
  }
};
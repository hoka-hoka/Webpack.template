const fs = require('fs'); // утилиты для работы с файлами
const paths = require('./webpack.paths.config');
var webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin'); // для копирования файлов при build
const HtmlWebpackPlugin = require('html-webpack-plugin'); // создаёт автоматически index.html, может


const PAGES_DIR = `${paths.PATHS.src}/pug/pages/`;
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'));
const NODE_ENV = process.env.NODE_ENV || 'development';
/* При создании webpakc формирует граф зависимостей, где стартовая точка это точка входя entry */

module.exports = function(){
  return {
    externals: { // для обращения к path из build и dev
      paths: paths.PATHS
    },
    entry: { // точка входа указывает на начало приложения
      home: paths.PATHS.src_home,
    },
    output: {
      filename: `${paths.PATHS.assets}js/[name].js`, // для каждой точки входа свой выход (EC6 - ${})
      path: paths.PATHS.dist, // __dirname + 'dist' (конкатенация путей)
      publicPath: '/' // /js/[name].js, в конце всегда слэш
    },
    devtool: NODE_ENV == 'development' ? 'cheap-inline-module-source-map' : null,

    optimization: {
      splitChunks: {
        chunks: 'all',
        automaticNameDelimiter: '-',
        automaticNameMaxLength: 20,
        chunks (chunk) {
          return chunk.name !== 'chunk';
        }

      }
    },
    performance: {
      hints: process.env.NODE_ENV === 'production' ? "warning" : false
    },

    plugins: [
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(NODE_ENV)
      }),

      new CopyPlugin({
        patterns: [
          { from: `${paths.PATHS.src}/${paths.PATHS.assets}img`, to: `${paths.PATHS.assets}img`},
          // { from: `${paths.PATHS.src}/${paths.PATHS.assets}fonts`, to: `${paths.PATHS.assets}fonts`},
          { from: `${paths.PATHS.src}/static`, to: ''},
        ],
        options: { concurrency: 50 },
      }),

      ...PAGES.map(page => new HtmlWebpackPlugin(
        {
          template: `${PAGES_DIR}/${page}`,
          filename: `./${page.replace(/\.pug/,'.html')}`, // исходный index с заменой
          hash: true // md5
        }
      )),
      new webpack.ProvidePlugin({ 
// плагин встроен в Webpack и автоматически создаёт import. Для этого в плагин нужно передать
// идентификатор и сам модуль. Парсер webpack esprima, встретив идентификатор, сгенерирует код
// загрузки этого модуля.
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      })
    ]
  }
};

/* При использовании HtmlWebpackPlugin "Ручной" файл index.html можно удалить. В результате сборки сгенерируется пустой index.html
с тегом script, по пути точки выхода. Если мы хотим, чтобы в сгенерированном файле был и пользовательский
контент, то нужно указать HtmlWebpackPlugin шаблон, на который он будет ссылаться */

/*new HtmlWebpackPlugin({
  hash: true, // md5 ?
  template: `${paths.PATHS.src}/index.html`, // тот шаблон
  filename: './index.html'
}),*/
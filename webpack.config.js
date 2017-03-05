const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

/* Plugins */
const HtmlwebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const SimpleProgressPlugin = require('webpack-simple-progress-plugin');

/* Helpers */
const pathTo = pathString => path.resolve(__dirname, pathString);
const isDevelopment = (process.env.NODE_ENV === 'development');

/* Constants */
const APP_TITLE = 'My application';
const MOMENTJS_LOCALES = 'ru|en-gb';

const SOURCE_DIR = pathTo('./src/');
const BUILD_DIR = pathTo('./public/');
const ASSETS_DIR = pathTo('./assets/');
const IMAGES_DIR = pathTo('./assets/images/');
// const ICONS_DIR = pathTo('./assets/icons/');
const FONTS_DIR = pathTo('./assets/fonts/');
const NODE_MODULES_DIR = pathTo('./node_modules/');
const FAVICON_BGCOLOR = '#fff';

/* Configuration */
module.exports = {
  context: SOURCE_DIR,
  entry: {
    index: './index.js',
  },
  output: {
    path: BUILD_DIR,
    publicPath: '/',
    filename: '[name]-[hash:7].bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: NODE_MODULES_DIR,
        options: {
          presets: [['es2015', { modules: false }]],
          plugins: [
            'syntax-dynamic-import',
            'transform-async-to-generator',
            'transform-regenerator',
            'transform-runtime',
          ],
        },
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader' },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [autoprefixer],
              },
            },
          ],
        }),
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader' },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [autoprefixer],
              },
            },
            { loader: 'resolve-url-loader' },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'sass-resources-loader',
              options: {
                resources: [
                  `${ASSETS_DIR}/styles/variables/variables.scss`,
                  `${ASSETS_DIR}/styles/variables/colors.scss`,
                  `${ASSETS_DIR}/styles/variables/media.scss`,
                  `${ASSETS_DIR}/styles/common.scss`,
                  `${ASSETS_DIR}/fonts/fonts.scss`,
                ],
                sourceMap: true,
              },
            },
          ],
        }),

      },
      {
        test: /\.(png|gif|jpg|svg)$/,
        loader: 'url-loader',
        include: IMAGES_DIR,
        options: {
          name: 'assets/[name]-[hash:7].[ext]',
          limit: 20480,
        },
      },
      {
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'url-loader',
        include: FONTS_DIR,
        options: {
          name: 'fonts/[name]-[hash:7].[ext]',
          limit: 20480,
        },
      },
    ],
  },

  resolve: {
    alias: {
      assets: ASSETS_DIR,
    },
    modules: [
      SOURCE_DIR,
      NODE_MODULES_DIR,
    ],
  },

  plugins: [
    new FriendlyErrorsWebpackPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),

    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV || 'development',
    }),

    new CleanWebpackPlugin([BUILD_DIR], {
      dry: isDevelopment,
      verbose: !isDevelopment,
    }),

    /* Import only MOMENTJS_LOCALES from MomentJS */
    new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, new RegExp(`^\\.\\/(${MOMENTJS_LOCALES})$`)),

    new ExtractTextPlugin({
      filename: 'styles/[name]-[contenthash:7].bundle.css',
      disable: isDevelopment,
    }),

    new FaviconsWebpackPlugin({
      title: APP_TITLE,
      background: FAVICON_BGCOLOR,
      logo: `${IMAGES_DIR}/logo.png`,
      prefix: 'favicons-[hash:7]/',
      emitStats: false,
    }),

    new HtmlwebpackPlugin({
      title: APP_TITLE,
      template: `${SOURCE_DIR}/templates/index.hbs`,
    }),

    new CommonsChunkPlugin({
      name: 'common',
      filename: '[name]-[hash].bundle.js',
      minChunks: 2,
      async: true,
    }),

    new webpack.LoaderOptionsPlugin({
      minimize: !isDevelopment,
      debug: isDevelopment,
    }),

    new webpack.optimize.UglifyJsPlugin(),
    new SimpleProgressPlugin(),
  ],

  devtool: isDevelopment ? 'eval-source-map' : '',
  stats: 'minimal',

  devServer: {
    contentBase: BUILD_DIR,
    compress: true,
    historyApiFallback: true,
    port: 5000,
    hot: true,
    overlay: {
      warnings: true,
      errors: true,
    },
  },
};

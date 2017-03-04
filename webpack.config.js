const path = require('path');

const pathTo = (pathString) => {
  return path.resolve(__dirname, pathString);
}

module.exports = {
  entry: pathTo('./src/index.js'),
  output: {
    path: pathTo('./build/'),
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: pathTo('./node_modules/'),
        options: {
            plugins: ['transform-runtime'],
            presets: ['es2015'],
        }
      }
    ]
  }
};
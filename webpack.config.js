'use strict';

const path = require('path');

module.exports = {
 entry: './web-pack-file.js',
 output: {
  path: path.resolve(__dirname, 'dist'),
  filename: 'webpack.bundle.js',
 },
};

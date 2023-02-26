const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const errHandle = (err, stats) => {
  if (err || stats.hasErrors()) {
    console.error(err || stats.compilation.errors);
    return;
  }
  console.log('Bundling completed successfully!');
}

const fscback = (err) => {
  if (err) {
    console.error('Failed to copy file', err);
    return;
  }
  console.log('File copied successfully');
};

let entryFile = path.resolve(__dirname, 'node_modules/bootstrap/js/src/collapse.js');
let outputFile = 'collapse.min.js';
const outputFolder = path.resolve(__dirname, 'static/js');

const config = {
  entry: entryFile,
  output: {
    path: outputFolder,
    filename: outputFile
  },
  optimization: {
    minimize: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
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



webpack(config, errHandle);

let sourceFile = path.join(__dirname, 'node_modules', 'photoswipe', 'dist', 'photoswipe.esm.min.js');
let destinationFile = path.join(__dirname, 'static', 'js', 'photoswipe.esm.min.js');
fs.copyFile(sourceFile, destinationFile, fscback);

sourceFile = path.join(__dirname, 'node_modules', 'photoswipe', 'dist', 'photoswipe-lightbox.esm.min.js');
destinationFile = path.join(__dirname, 'static', 'js', 'photoswipe-lightbox.esm.min.js');
fs.copyFile(sourceFile, destinationFile, fscback);
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const dotenv = require('dotenv');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const getEnvConfig = (env) => {
  const currentPath = path.join(__dirname);
  const basePath = `${currentPath}/.env`;
  const envPath = `${basePath}.${env.ENVIRONMENT}`;
  const fileEnv = dotenv.config({
    path: fs.existsSync(envPath) ? envPath : basePath,
  }).parsed;

  return Object.keys(fileEnv).reduce((prev, next) => {
    // eslint-disable-next-line no-param-reassign
    prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
    return prev;
  }, {});
};

module.exports = (env) => ({
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: './index.js',
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new webpack.EnvironmentPlugin(getEnvConfig(env)),
  ],
  output: {
    filename: 'owly-virtual-tour.js',
    libraryTarget: 'umd',
    library: 'owlyVirtualTourModule',
    umdNamedDefine: true,
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
    ],
  },
});

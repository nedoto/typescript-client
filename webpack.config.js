const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => ({
  mode: argv.mode,
  entry: './src/NedotoClient.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'nedoto-client-1.0.0.js',
    library: 'NedotoClient',
    libraryTarget: 'umd',
    libraryExport: 'default',
    globalObject: 'this',
  },
  watch: argv.mode === 'development',
  optimization: {
    minimize: argv.mode === 'production',
    minimizer: [new TerserPlugin()],
  },
});

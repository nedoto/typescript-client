const path = require('path');
const packageJson = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin');
const TypescriptDeclarationPlugin = require('typescript-declaration-webpack-plugin');

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
    extensions: [ '.ts', '.js' ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `nedoto-client-${packageJson.version}.js`,
    libraryTarget: 'umd',
    library: 'nedoto',
    umdNamedDefine: true,
  },
  watch: argv.mode === 'development',
  optimization: {
    minimize: argv.mode === 'production',
    minimizer: [ new TerserPlugin() ],
  },
  plugins: [
    new TypescriptDeclarationPlugin(),
  ],
});

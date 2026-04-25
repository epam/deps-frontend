
import { FeatureNames } from '../src/enums/FeatureNames'
const path = require('path')
const dotenv = require('dotenv')
const dotenvParseVariables = require('dotenv-parse-variables')
const { DefinePlugin } = require('webpack')
const { merge } = require('webpack-merge')
const paths = require('./paths.config')
const common = require('./webpack.common.js')

const ENABLED_FEATURES_NAMES = [FeatureNames.SHOW_NOT_IMPLEMENTED]

const env = dotenv.config({
  path: path.resolve(paths.root, '.env')
}).parsed

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-source-map',
  devServer: {
    historyApiFallback: true,
    open: true,
    client: {
      overlay: false
    }
  },
  plugins: [
    new DefinePlugin({
      staticEnv: JSON.stringify(dotenvParseVariables(env)),
      FEATURES: JSON.stringify(ENABLED_FEATURES_NAMES)
    })
  ]
})


const path = require('path')
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { ModuleFederationPlugin } = require('webpack').container
const dependencies = require('../package.json').dependencies
const themeVariables = require('./antd/antd-theme')
const paths = require('./paths.config')

const cssLoaders = [
  MiniCssExtractPlugin.loader,
  {
    loader: require.resolve('css-loader'),
    options: {
      importLoaders: 1
    }
  },
  {
    loader: require.resolve('postcss-loader'),
    options: {
      postcssOptions: {
        plugins: [
          'postcss-preset-env',
          'postcss-flexbugs-fixes'
        ]
      }
    }
  }
]

module.exports = {
  entry: paths.app.entry,
  output: {
    path: paths.dist,
    publicPath: '/',
    filename: 'scripts/[name].[contenthash].js',
    chunkFilename: 'scripts/[name].[contenthash].js',
    sourceMapFilename: '[file].map'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs'],
    alias: {
      '@': paths.app.src,
      '~': paths.root,
      handsontable: 'handsontable-mit'
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: require('./.babelrc.js')
      },
      {
        test: /\.m?jsx?$/,
        resolve: {
          fullySpecified: false
        }
      },
      {
        test: /\.css$/,
        use: cssLoaders
      },
      {
        test: /\.less$/,
        use: [
          ...cssLoaders,
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
                modifyVars: themeVariables
              }
            }
          }
        ]
      },
      {
        test: /\.svg$/i,
        use: ['@svgr/webpack'],
        issuer: /\.(js|ts)x?$/
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|)$/,
        type: 'asset/inline'
      },
      {
        exclude: [/\.(e|m)?js(x?)$/, /\.(c|le)ss$/, /\.html$/, /\.svg$/i, /\.(woff(2)?|eot|ttf|otf|)$/],
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash].css',
      chunkFilename: 'styles/[name].[contenthash].css'
    }),
    new AntdDayjsWebpackPlugin({
      replaceMoment: true,
      plugins: require('./antd/dayjs-plugins')
    }),
    new CaseSensitivePathsPlugin(),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(paths.publicDir, 'env-config.js') }
      ]
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(paths.publicDir, 'index.html'),
      favicon: paths.app.favicon,
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new CssMinimizerPlugin({
      minimizerOptions: {
        preset: [
          'default',
          {
            discardComments: {
              removeAll: true
            }
          }
        ]
      }
    }),
    new ModuleFederationPlugin({
      shared: {
        react: {
          requiredVersion: dependencies.react,
          singleton: true,
          eager: true
        },
        'react-dom': {
          requiredVersion: dependencies['react-dom'],
          singleton: true,
          eager: true
        },
        'react-redux': {
          requiredVersion: dependencies['react-redux'],
          singleton: true,
          eager: true
        },
        'react-router-dom': {
          requiredVersion: dependencies['react-router-dom'],
          singleton: true,
          eager: true
        },
        'styled-components': {
          requiredVersion: dependencies['styled-components'],
          singleton: true,
          eager: true
        },
        'antd/lib/': {
          singleton: true,
          eager: true
        }
      }
    })
  ]
}

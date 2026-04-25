
const fs = require('fs')
const path = require('path')

const root = fs.realpathSync(process.cwd())
const config = path.resolve(root, 'config')
const packages = path.resolve(root, 'node_modules')
const src = path.resolve(root, 'src')
const vendors = path.resolve(root, 'vendors')
const dist = path.resolve(root, 'dist')
const publicDir = path.resolve(root, 'public')

module.exports = {
  root,
  dist,
  config: {
    root: config,
    antd: path.resolve(config, 'antd'),
    jest: path.resolve(config, 'jest')
  },
  packages,
  app: {
    src,
    vendors,
    entry: path.resolve(src, 'application/index.jsx'),
    favicon: path.resolve(src, 'assets/images/favicon.png')
  },
  publicDir
}

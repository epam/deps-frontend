const plugins = [
    '@babel/plugin-transform-private-methods',
    [
      'babel-plugin-styled-components',
      {
        pure: true
      }
    ]
  ]

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    [
      'transform-react-remove-prop-types',
      {
        'removeImport': true,
        'additionalLibraries': ['react-style-proptype']
      }
    ]
  )
}

module.exports = {
  plugins,
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3
      }
    ],
    [
      '@babel/preset-react',
      {
         runtime: 'automatic'
      }
    ],
    '@babel/preset-typescript'
  ]
}

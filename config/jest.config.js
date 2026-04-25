
const path = require('path')
const paths = require('./paths.config')

module.exports = {
  rootDir: paths.root,
  roots: [
    paths.app.src
  ],
  // TODO: #2123
  ...(!process.env.CI_NODE_INDEX && {
    coverageThreshold: {
      global: {
        branches: 73,
        functions: 78,
        lines: 87,
        statements: 86
      }
    }
  }),
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/src/**/*.styles.js',
    '!<rootDir>/src/**/*.styles.ts',
    '!<rootDir>/src/**/index.js',
    '!<rootDir>/src/**/index.ts',
    '!<rootDir>/src/mocks/**',
    '!<rootDir>/src/utils/moduleFederation.js',
    '!<rootDir>/src/**/*.d.ts'
  ],
  setupFilesAfterEnv: [
    path.resolve(paths.config.jest, 'dayjs.setup.js'),
    path.resolve(paths.config.jest, 'enzyme.setup.js'),
    path.resolve(paths.config.jest, 'polyfill.setup.js'),
    path.resolve(paths.config.jest, 'styled.setup.js'),
    path.resolve(paths.config.jest, 'jest.overrides.js'),
    path.resolve(paths.config.jest, 'jestDom.setup.js'),
    'jest-canvas-mock'
  ],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {
        configFile: path.resolve(paths.config.root, 'jest.babelrc.js')
      }
    ],
    '^.+\\.css$': path.resolve(paths.config.jest, 'emptyTransform.js'),
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': path.resolve(paths.config.jest, 'emptyTransform.js')
  },
  moduleDirectories: [
    'node_modules',
    'src'
  ],
  moduleNameMapper: {
    '^dayjs/locale': path.resolve(paths.config.jest, 'emptyModule.js'),
    '@/(.*)$': path.join(paths.app.src, '/$1'),
    '^handsontable$': 'handsontable-mit',
    '^axios$': path.resolve(paths.config.jest, 'axios.setup.js')
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\(?!(antd)\\).(js|jsx)$'
  ],
  snapshotSerializers: [
    'enzyme-to-json/serializer'
  ]
}


const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const UnusedWebpackPlugin = require('unused-webpack-plugin')
const { DefinePlugin } = require('webpack')
const { merge } = require('webpack-merge')
const ForceGCPlugin = require('../webpack/force-gc-plugin')
const paths = require('./paths.config')
const common = require('./webpack.common.js')

const plugins = [
  new ForceGCPlugin({
    interval: 1000
  }),
  new CleanWebpackPlugin(),
  new DefinePlugin({
    staticEnv: JSON.stringify({}),
    FEATURES: JSON.stringify([])
  }),
  new UnusedWebpackPlugin({
    failOnUnused: true,
    directories: [
      paths.app.src
    ],
    exclude: [
      '*.d.ts',
      'types/*.d.ts',
      '*.test.*',
      '*.snap',
      'assets/*',
      '*mock*.*',
      '**/__mocks__/*',
      'src/selectors/system.js', // TODO: #3704
      'containers/DocumentLabelingTool/mappers/mocks/*.*',
      'containers/DocumentLabelingTool/utils/*.*',
      'containers/DocumentsStorages/models/OneDriveFile.js',
      'components/Icons/PlusFilledIcon.jsx',
      'containers/AddCommentModal/*.*',
      'models/TemplateVersion.js',
      'models/MachineLearningModel.js',
      'models/DocumentTypeExtraField.js',
      'models/DocumentTypeV2.js',
      'models/Prototype.js',
      'models/MFEPageConfig.js',
      'models/ExtractionLLM.js',
      '/utils/shallowWithTheme.js',
      '/utils/rendererRTL.jsx',
      'services/OCRExtractionService/OCRGrid/*',
      'models/AIConversation.js',
      'enums/ValidationRuleSeverity.js',
      'models/Validator.js',
      'models/DocumentTypesGroup.js'
    ]
  })
]

module.exports = merge(common, {
  mode: 'production',
  devtool: (
    process.env.ENABLE_SOURCE_MAP === 'true'
      ? 'source-map'
      : false
  ),
  bail: true,
  plugins,
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: false
      })
    ]
  }
})

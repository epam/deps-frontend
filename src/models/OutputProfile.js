
import PropTypes from 'prop-types'
import isRequiredIf from 'react-proptype-conditional-require'
import { FILE_EXTENSION_TO_DOWNLOAD_FORMAT } from '@/enums/FileExtension'
import { OutputProfileType } from '@/enums/OutputProfileType'

class ExtractedDataSchema {
  constructor ({
    fields,
    needsValidationResults,
  }) {
    this.fields = fields
    this.needsValidationResults = needsValidationResults
  }
}

const extractedDataShape = PropTypes.shape({
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  needsValidationResults: PropTypes.bool.isRequired,
})

class DocumentLayoutSchema {
  constructor ({
    features,
    parsingType,
  }) {
    this.features = features
    this.parsingType = parsingType
  }
}

const documentLayoutShape = PropTypes.shape({
  features: PropTypes.arrayOf(PropTypes.string).isRequired,
  parsingType: PropTypes.string.isRequired,
})

const formatShape = PropTypes.oneOf(
  Object.values(FILE_EXTENSION_TO_DOWNLOAD_FORMAT),
)

const ExportingType = {
  PLUGIN: 'plugin',
  BUILT_IN: 'builtin',
}

class OutputProfile {
  constructor ({
    id,
    exportingType,
    name,
    format,
    creationDate,
    version,
    schema,
  }) {
    this.id = id
    this.exportingType = exportingType
    this.name = name
    this.format = format
    this.creationDate = creationDate
    this.version = version
    this.schema = schema
  }

  static isPlugin = (profile) => profile.exportingType === ExportingType.PLUGIN

  static getOutputProfileTypeBySchema = (profile) => {
    if (profile.schema.fields) {
      return OutputProfileType.BY_EXTRACTOR
    }

    return OutputProfileType.BY_LAYOUT
  }
}

const outputProfileShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  format: PropTypes.oneOfType([
    isRequiredIf(
      PropTypes.string,
      (props) => OutputProfile.isPlugin(props),
    ),
    isRequiredIf(
      formatShape,
      (props) => !OutputProfile.isPlugin(props),
    ),
  ]).isRequired,
  creationDate: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
  exportingType: PropTypes.oneOf(
    Object.values(ExportingType),
  ).isRequired,
  schema: isRequiredIf(
    PropTypes.oneOfType([
      extractedDataShape,
      documentLayoutShape,
    ]),
    (props) => !OutputProfile.isPlugin(props),
  ),
})

export {
  OutputProfile,
  ExtractedDataSchema,
  DocumentLayoutSchema,
  documentLayoutShape,
  extractedDataShape,
  formatShape,
  outputProfileShape,
  ExportingType,
}

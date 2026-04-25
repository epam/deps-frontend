
import PropTypes from 'prop-types'
import { FilesStorage } from '@/enums/FilesStorage'
import { KnownLanguage } from '@/enums/KnownLanguage'
import { KnownParsingFeature } from '@/enums/KnownParsingFeature'

class FileImportConfig {
  constructor ({
    paths,
    source,
    engine,
    language,
    documentType,
    invokeExtraction,
    assignedToMe,
    parsingFeatures,
    llmType,
  }) {
    this.paths = paths
    this.source = source
    this.engine = engine
    this.language = language
    this.documentType = documentType
    this.invokeExtraction = invokeExtraction
    this.assignedToMe = assignedToMe
    this.parsingFeatures = parsingFeatures
    this.llmType = llmType
  }
}

const fileImportConfigShape = PropTypes.shape({
  paths: PropTypes.arrayOf(PropTypes.string).isRequired,
  source: PropTypes.oneOf(Object.values(FilesStorage)).isRequired,
  engine: PropTypes.string,
  language: PropTypes.oneOf(Object.values(KnownLanguage)),
  documentType: PropTypes.string,
  invokeExtraction: PropTypes.bool,
  assignedToMe: PropTypes.bool,
  parsingFeatures: PropTypes.arrayOf(
    PropTypes.oneOf(
      Object.values(KnownParsingFeature),
    ),
  ),
  llmType: PropTypes.string,
})

export {
  FileImportConfig,
  fileImportConfigShape,
}

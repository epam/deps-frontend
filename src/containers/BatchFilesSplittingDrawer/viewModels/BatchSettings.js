
import PropTypes from 'prop-types'
import { documentTypesGroupShape } from '@/models/DocumentTypesGroup'

export class BatchSettings {
  constructor ({
    group,
    llmType,
    engine,
    parsingFeatures,
  }) {
    this.group = group
    this.llmType = llmType
    this.engine = engine
    this.parsingFeatures = parsingFeatures
  }
}

export const batchSettingsShape = PropTypes.shape({
  group: documentTypesGroupShape,
  llmType: PropTypes.string,
  engine: PropTypes.string,
  parsingFeatures: PropTypes.arrayOf(PropTypes.string).isRequired,
})

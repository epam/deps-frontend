
import PropTypes from 'prop-types'
import { v4 as uuidv4 } from 'uuid'

export class Extractor {
  constructor ({
    id = uuidv4(),
    customInstruction,
    groupingFactor,
    model,
    name,
    pageSpan,
    temperature,
    topP,
  }) {
    this.id = id
    this.customInstruction = customInstruction
    this.groupingFactor = groupingFactor
    this.model = model
    this.name = name
    this.pageSpan = pageSpan
    this.temperature = temperature
    this.topP = topP
  }

  static isValid = (extractor) => (
    extractor.customInstruction !== undefined &&
    extractor.groupingFactor !== undefined &&
    extractor.model !== undefined &&
    extractor.temperature !== undefined &&
    extractor.topP !== undefined
  )
}

export const extractorShape = PropTypes.exact({
  id: PropTypes.string.isRequired,
  customInstruction: PropTypes.string,
  groupingFactor: PropTypes.number,
  model: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  pageSpan: PropTypes.shape({
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
  }),
  temperature: PropTypes.number.isRequired,
  topP: PropTypes.number.isRequired,
})


import has from 'lodash/has'
import PropTypes from 'prop-types'
import { NOT_APPLICABLE_CONFIDENCE_LEVEL } from '@/constants/confidence'
import { ExtractedDataCoordsType } from '@/enums/ExtractedDataCoordsType'
import {
  sourceBboxCoordinatesShape,
  sourceTableCoordinatesShape,
  sourceTextCoordinatesShape,
} from '@/models/SourceCoordinates'
import { fieldCoordinatesShape } from '../FieldCoordinates'
import { tableCoordinatesShape } from '../TableCoordinates'

class FieldData {
  constructor (
    value = '',
    coordinates = null,
    confidence = NOT_APPLICABLE_CONFIDENCE_LEVEL,
    tableCoordinates = null,
    index,
    sourceTableCoordinates = null,
    sourceBboxCoordinates = null,
    modifiedBy,
    setIndex = null,
    sourceTextCoordinates = null,
    id,
  ) {
    this.value = value
    this.coordinates = coordinates
    this.tableCoordinates = tableCoordinates
    this.sourceTableCoordinates = sourceTableCoordinates
    this.sourceBboxCoordinates = sourceBboxCoordinates
    this.confidence = confidence
    index !== undefined && (this.index = index)
    modifiedBy && (this.modifiedBy = modifiedBy)
    this.setIndex = setIndex
    this.sourceTextCoordinates = sourceTextCoordinates
    id && (this.id = id)
  }

  static isValid = (fieldData) => (
    has(fieldData, ExtractedDataCoordsType.COORDINATES) &&
    has(fieldData, ExtractedDataCoordsType.TABLE_COORDINATES) &&
    has(fieldData, 'value') &&
    has(fieldData, 'confidence')
  )
}

const EMPTY_FIELD_DATA = new FieldData()

const fieldDataShape = PropTypes.shape({
  confidence: PropTypes.number,
  coordinates: PropTypes.oneOfType([
    PropTypes.arrayOf(fieldCoordinatesShape),
    fieldCoordinatesShape,
  ]),
  tableCoordinates: PropTypes.arrayOf(tableCoordinatesShape),
  sourceBboxCoordinates: PropTypes.arrayOf(sourceBboxCoordinatesShape),
  sourceTableCoordinates: PropTypes.arrayOf(sourceTableCoordinatesShape),
  sourceTextCoordinates: PropTypes.arrayOf(sourceTextCoordinatesShape),
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]),
  index: PropTypes.number,
  modifiedBy: PropTypes.string,
  setIndex: PropTypes.number,
})

class DictFieldData {
  constructor (
    key = new FieldData(),
    value = new FieldData(),
    id,
  ) {
    this.key = key
    this.value = value
    id && (this.id = id)
  }

  static isValid = (fieldData) => (
    has(fieldData, 'key') &&
    has(fieldData, 'value')
  )

  static isDictData = (data) => has(data, 'key') && has(data, 'value')
}

const dictFieldDataShape = PropTypes.shape({
  key: fieldDataShape,
  value: fieldDataShape,
  id: PropTypes.string,
})

export {
  DictFieldData,
  dictFieldDataShape,
  FieldData,
  fieldDataShape,
  EMPTY_FIELD_DATA,
}


import isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import {
  fieldDataShape,
  dictFieldDataShape,
  DictFieldData,
} from './FieldData'
import { tableDataShape } from './TableField'

const mapFieldCoordinatesToV1 = (fieldData) => ({
  ...fieldData,
  coordinates: isEmpty(fieldData.coordinates) ? null : fieldData.coordinates,
})

class ExtractedDataFieldV2 {
  constructor (
    fieldCode,
    data,
    modifiedBy,
    aliases,
  ) {
    this.fieldCode = fieldCode
    this.data = data
    modifiedBy && (this.modifiedBy = modifiedBy)
    aliases && (this.aliases = aliases)
  }

  static toExtractedDataFieldV1 = (field) => ({
    ...field,
    data: ExtractedDataFieldV2.toFieldDataV1(field.data),
    fieldPk: field.fieldCode,
  })

  static toFieldDataV1 = (fieldData) => {
    if (Array.isArray(fieldData)) {
      return fieldData.map((item) => {
        if (DictFieldData.isDictData(item)) {
          return {
            ...item,
            key: mapFieldCoordinatesToV1(item.key),
            value: mapFieldCoordinatesToV1(item.value),
          }
        }

        return mapFieldCoordinatesToV1(item)
      })
    }

    if (DictFieldData.isDictData(fieldData)) {
      return {
        ...fieldData,
        key: mapFieldCoordinatesToV1(fieldData.key),
        value: mapFieldCoordinatesToV1(fieldData.value),
      }
    }

    return mapFieldCoordinatesToV1(fieldData)
  }
}

const extractedDataFieldV2Shape = PropTypes.shape({
  fieldCode: PropTypes.oneOfType([
    PropTypes.number.isRequired,
    PropTypes.string.isRequired,
  ]),
  data: PropTypes.oneOfType([
    dictFieldDataShape,
    fieldDataShape,
    tableDataShape,
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        dictFieldDataShape,
        fieldDataShape,
        tableDataShape,
      ]),
    ),
  ]),
  modifiedBy: PropTypes.string,
  aliases: PropTypes.shape({
    [PropTypes.string]: PropTypes.string,
  }),
})

export {
  ExtractedDataFieldV2,
  extractedDataFieldV2Shape,
}

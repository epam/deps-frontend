
/* eslint-disable camelcase */
import has from 'lodash/has'
import isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import { NOT_APPLICABLE_CONFIDENCE_LEVEL } from '@/constants/confidence'
import { FieldType } from '@/enums/FieldType'
import { Comment } from '@/models/Comment'
import { KEY_INDEX, VALUE_INDEX } from '@/models/DocumentTypeField'
import { TableCoordinates } from '../TableCoordinates'
import {
  fieldDataShape,
  dictFieldDataShape,
  FieldData,
  DictFieldData,
} from './FieldData'
import {
  ListField,
} from './ListField'
import { tableDataShape, TableData } from './TableField'

class ExtractedDataField {
  constructor (
    fieldPk,
    data,
    modifiedBy,
    aliases,
  ) {
    this.fieldPk = fieldPk
    this.data = data
    modifiedBy && (this.modifiedBy = modifiedBy)
    aliases && (this.aliases = aliases)
  }

  static isValid = (edField) => (
    has(edField, 'fieldPk') &&
    has(edField, 'data')
  )

  static isNotEmptyCoords = (edField) => (
    (
      edField.data.cells &&
      TableCoordinates.hasCoordsInCells(edField.data.cells)
    ) ||
    !!edField.data.tableCoordinates?.[0]?.cellRange?.length ||
    !!edField.data.sourceTableCoordinates?.[0]?.cellRanges?.length ||
    !!edField.data.sourceBboxCoordinates?.[0]?.bboxes?.length ||
    !!edField.data.sourceTextCoordinates?.[0]?.charRanges?.length ||
    (
      edField.data.coordinates &&
      !edField.data.coordinates.length
    ) ||
    !!edField.data.coordinates?.length
  )

  static getConfidencePercent = (edField) => {
    if (
      edField.data?.confidence === NOT_APPLICABLE_CONFIDENCE_LEVEL
    ) {
      return NOT_APPLICABLE_CONFIDENCE_LEVEL
    }

    return Math.round(edField.data?.confidence * 100)
  }

  static addComment = (fieldToUpdate, commentText, createdBy) => {
    return {
      ...fieldToUpdate,
      comments: [
        ...(fieldToUpdate.comments ?? []),
        new Comment(commentText, createdBy, new Date().toString()),
      ],
    }
  }

  static setIndexToData = (fieldToUpdate) => ({
    ...fieldToUpdate,
    data: fieldToUpdate.data.map((d, index) => ({
      ...d,
      index,
    })),
  })

  static getValue = (edField) => edField.data?.value?.value ?? edField.data?.value

  static setValue = (key, fieldToUpdate, newValue, fieldIndex, fieldId, modifiedBy) => {
    let updatedField
    if (Array.isArray(fieldToUpdate.data)) {
      updatedField = {
        ...fieldToUpdate,
        data: [...fieldToUpdate.data],
      }
      if (!fieldId) {
        updatedField.data[fieldIndex] = {
          ...updatedField.data[fieldIndex],
          [key]: newValue,
          modifiedBy,
        }
      } else {
        updatedField.data[fieldIndex][fieldId] = {
          ...updatedField.data[fieldIndex][fieldId],
          [key]: newValue,
          modifiedBy,
        }
      }
    } else {
      if (!fieldId) {
        updatedField = {
          ...fieldToUpdate,
          data: {
            ...fieldToUpdate.data,
            [key]: newValue,
            modifiedBy,
          },
        }
      } else {
        updatedField = {
          ...fieldToUpdate,
          data: {
            ...fieldToUpdate.data,
            [fieldId]: {
              ...fieldToUpdate.data[fieldId],
              [key]: newValue,
              modifiedBy,
            },
          },
        }
      }
    }

    return updatedField
  }

  static addEmptyFieldDataToContainerField = (fieldToUpdate) => {
    switch (fieldToUpdate.fieldType) {
      case FieldType.LIST:
        return {
          ...fieldToUpdate,
          data: [
            ...fieldToUpdate.data,
            new FieldData(),
          ],
        }
      case FieldType.DICTIONARY:
        return {
          ...fieldToUpdate,
          data: [
            ...fieldToUpdate.data,
            new DictFieldData(),
          ],
        }
    }
  }

  static removeSubContainerField = (fieldToUpdate, fieldIndex) => {
    return {
      ...fieldToUpdate,
      data: fieldToUpdate.data.filter((f, i) => i !== fieldIndex),
    }
  }

  static getEmptyData = (dtf) => {
    if ([KEY_INDEX, VALUE_INDEX].includes(dtf.fieldId) && dtf.fieldIndex === undefined) {
      return new DictFieldData()
    }
    // TODO #3222
    switch (dtf.fieldType) {
      case FieldType.LIST:
        switch (dtf.fieldMeta.baseType) {
          case FieldType.TABLE:
            return [new TableData()]

          case FieldType.DICTIONARY:
            return [new DictFieldData()]

          case FieldType.CHECKMARK:
            return [new FieldData(null)]

          default:
            return [new FieldData()]
        }

      case FieldType.TABLE:
        return dtf.fieldIndex !== undefined ? [new TableData()] : new TableData()

      case FieldType.DICTIONARY:
        return dtf.fieldIndex !== undefined ? [new DictFieldData()] : new DictFieldData()

      case FieldType.CHECKMARK:
        return dtf.fieldIndex !== undefined ? [new FieldData(null)] : new FieldData(null)

      default : {
        if (dtf.fieldIndex !== undefined && dtf.fieldId) {
          return [new DictFieldData()]
        } else if (dtf.fieldIndex !== undefined && !dtf.fieldId) {
          return [new FieldData()]
        } else {
          return new FieldData()
        }
      }
    }
  }

  static isEmpty = (fieldData, fieldDefinition) => {
    switch (fieldDefinition.fieldType) {
      case FieldType.LIST:
        return ListField.isEmpty(fieldData.data)
      default:
        return isEmpty(fieldData.data)
    }
  }

  static hasCoordinates = (data) => {
    const {
      coordinates,
      tableCoordinates,
      sourceBboxCoordinates,
      sourceTableCoordinates,
      sourceTextCoordinates,
      cells,
    } = data

    return (
      (
        !isEmpty(cells) &&
        TableCoordinates.hasCoordsInCells(cells)
      ) ||
      !isEmpty(coordinates) ||
      !isEmpty(tableCoordinates) ||
      !isEmpty(sourceBboxCoordinates) ||
      !isEmpty(sourceTableCoordinates) ||
      !isEmpty(sourceTextCoordinates)
    )
  }

  static getPagesFromFieldData = (data, document) => {
    if (!ExtractedDataField.hasCoordinates(data)) {
      return [null]
    }

    const {
      coordinates,
      tableCoordinates,
      sourceBboxCoordinates,
      sourceTableCoordinates,
      sourceTextCoordinates,
      cells,
    } = data

    if (
      sourceBboxCoordinates?.length ||
      sourceTableCoordinates?.length ||
      sourceTextCoordinates?.length
    ) {
      const sourceCoords = sourceBboxCoordinates ?? sourceTableCoordinates ?? sourceTextCoordinates

      return sourceCoords.map((c) => Object.values(document.unifiedData)
        .flat()
        .find((d) => d.id === c.sourceId)
        .page,
      )
    }

    if (coordinates?.length || tableCoordinates?.length) {
      const coords = coordinates ?? tableCoordinates

      return coords.map((c) => c.page)
    }

    if (cells?.length) {
      return TableCoordinates.getTablePagesFromCells(document, cells)
    }

    return [coordinates?.page]
  }

  static getPages = (data, document) => {
    if (Array.isArray(data)) {
      const pages = data.flatMap((d) => ExtractedDataField.getPages(d, document))

      return [...new Set([...pages])]
    }

    if (DictFieldData.isDictData(data)) {
      const keyPages = ExtractedDataField
        .getPagesFromFieldData(data.key, document)
        .filter((p) => !!p)

      const valuePages = ExtractedDataField
        .getPagesFromFieldData(data.value, document)
        .filter((p) => !!p)

      const uniquePages = (
        !keyPages.length && !valuePages.length
          ? [null]
          : new Set([...keyPages, ...valuePages])
      )

      return [...uniquePages]
    }

    const pages = ExtractedDataField.getPagesFromFieldData(data, document)

    return [...new Set([...pages])]
  }

  static getSetIndexes = (data) => {
    if (Array.isArray(data)) {
      return data.reduce((acc, curr) => {
        if (DictFieldData.isDictData(curr)) {
          const { key, value } = curr
          acc.push(key.setIndex, value.setIndex)
          return acc
        }
        acc.push(curr.setIndex)
        return acc
      }, [])
    }

    if (DictFieldData.isDictData(data)) {
      const { key, value } = data
      return [key.setIndex, value.setIndex]
    }

    return [data.setIndex]
  }

  static getFieldDataBySetIndex = (ed, setIndex) => {
    const index = isNaN(setIndex) ? null : setIndex

    if (Array.isArray(ed.data)) {
      const fields = []

      ed.data.forEach((data) => {
        if (DictFieldData.isDictData(data)) {
          (
            Object.values(data).some((d) => d.setIndex === index)
          ) && (
            fields.push(data)
          )
        }

        data.setIndex === index && (
          fields.push(data)
        )
      })

      return (
        !!fields.length && ({
          ...ed,
          data: fields,
        })
      )
    }

    if (
      DictFieldData.isDictData(ed.data) &&
      Object.values(ed.data).some((d) => d.setIndex === index)
    ) {
      return ed
    }

    return ed.data.setIndex === index && ed
  }

  static getEmptyAliases = (dtField) => dtField.fieldType === FieldType.LIST ? {} : null

  static updateFieldAliases = (fieldToUpdate, updatedAliases) => {
    return {
      ...fieldToUpdate,
      aliases: {
        ...fieldToUpdate.aliases,
        ...updatedAliases,
      },
    }
  }
}

const extractedDataFieldShape = PropTypes.shape({
  fieldPk: PropTypes.oneOfType([
    PropTypes.number.isRequired,
    PropTypes.string.isRequired,
  ]),
  data: PropTypes.oneOfType([
    tableDataShape,
    fieldDataShape,
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        fieldDataShape,
        dictFieldDataShape,
        tableDataShape,
      ]),
    ),
    dictFieldDataShape,
  ]),
  modifiedBy: PropTypes.string,
  aliases: PropTypes.shape({
    [PropTypes.string]: PropTypes.string,
  }),
})

export { ExtractedDataField, extractedDataFieldShape }

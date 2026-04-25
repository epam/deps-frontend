
import isEqual from 'lodash/isEqual'
import isNumber from 'lodash/isNumber'
import PropTypes from 'prop-types'
import { HTCellRange } from '@/components/HandsonTable/models/HTCellRange'
import { FieldType } from '@/enums/FieldType'
import { Point, pointShape } from '@/models/Point'
import { DictField } from './ExtractedData'
import { StringField } from './ExtractedData/StringField'
import { sourceCharRangeShape } from './SourceCoordinates'

class HighlightedField {
  static getHighlightedField = (dtField, edField, highlightedField) => {
    if (!edField) {
      return null
    }
    switch (dtField.fieldType) {
      case FieldType.DICTIONARY:
        return DictField.getHighlightedFieldData(edField.data, highlightedField)
      default:
        return StringField.getHighlightedFieldData(edField.data, highlightedField)
    }
  }

  static isRanges = (highlightedFields) => highlightedFields.every((hf) => (
    Array.isArray(hf) &&
    hf.every((item) => isNumber(item))
  ))

  static arePolygonCoords = (highlightedField) => highlightedField.flat().every((point) => Point.isValid(point))

  static getReducedRanges = (ranges) => {
    const { reducedRanges, unhandledRanges } = ranges.reduce((acc, range) => {
      if (range.length !== 2) {
        acc.reducedRanges.push(range)
      } else {
        acc.unhandledRanges.push(range)
      }
      return acc
    }, {
      reducedRanges: [],
      unhandledRanges: [],
    })

    const getReducedArea = (ranges) => {
      const topLeftCell = HTCellRange.getTopLeftCoordinates(ranges)
      let lastRow = topLeftCell[0]
      let lastColumn = topLeftCell[1]
      let unparsedRanges = [...ranges.filter((range) => !isEqual(range, topLeftCell))]
      const parsedCells = [topLeftCell]
      let isExpandableBottom, isExpandableRight

      const isExpandable = () => isExpandableBottom || isExpandableRight

      const getNextRowCoords = () => {
        const expectedNextRowLength = parsedCells.reduce((acc, [row]) => {
          if (row === lastRow) {
            acc++
          }
          return acc
        }, 0)

        const nextRow = unparsedRanges.filter(([row, column]) => {
          if (
            (row === lastRow + 1) &&
            (
              column >= topLeftCell[1] &&
              column <= lastColumn
            )) {
            return [row, column]
          }
        })
        if (nextRow.length === expectedNextRowLength) {
          return nextRow
        }
      }

      const getNextColumnCoords = () => {
        const expectedNextColumnLength = parsedCells.reduce((acc, [, column]) => {
          if (column === lastColumn) {
            acc++
          }
          return acc
        }, 0)

        const nextColumn = unparsedRanges.filter(([row, column]) => {
          if (
            (column === lastColumn + 1) &&
            (
              row >= topLeftCell[0] &&
              row <= lastRow
            )) {
            return [row, column]
          }
        })

        if (nextColumn.length === expectedNextColumnLength) {
          return nextColumn
        }
      }

      const expandBottom = () => {
        const nextLine = getNextRowCoords()
        if (!nextLine) {
          isExpandableBottom = false
          return
        }
        lastRow = nextLine[0][0]
        updateCells(nextLine)
      }

      const expandRight = () => {
        const nextLine = getNextColumnCoords()
        if (!nextLine) {
          isExpandableRight = false
          return
        }
        lastColumn = nextLine[0][1]
        updateCells(nextLine)
      }

      const updateCells = (cells) => {
        parsedCells.push(...cells)
        unparsedRanges = unparsedRanges.filter((cellCoords) => !parsedCells.includes(cellCoords))
      }

      const expand = () => {
        if (!isExpandable()) {
          unparsedRanges = unparsedRanges.filter((cellCoords) => !isEqual(cellCoords, topLeftCell))
        }

        while (isExpandable()) {
          if (isExpandableBottom) {
            expandBottom()
          }

          if (isExpandableRight) {
            expandRight()
          }
        }
      }

      isExpandableBottom = !!getNextRowCoords()?.length
      isExpandableRight = !!getNextColumnCoords()?.length

      expand()

      return {
        area: [...topLeftCell, lastRow, lastColumn],
        unparsedRanges,
      }
    }

    const createAreas = (ranges) => {
      if (!ranges.length) {
        return
      }

      const { area, unparsedRanges } = getReducedArea(ranges)
      reducedRanges.push(area)
      return createAreas(unparsedRanges)
    }

    const uniqueUnhandledRanges = HTCellRange.removeDuplications(unhandledRanges)
    createAreas(uniqueUnhandledRanges)
    return reducedRanges
  }
}

const highlightedPolygonCoordsShape = PropTypes.arrayOf(
  PropTypes.arrayOf(
    pointShape,
  ),
)

const highlightedTableCoordsShape = PropTypes.arrayOf(
  PropTypes.arrayOf(
    PropTypes.number,
  ),
)

const highlightedTextCoordsShape = PropTypes.arrayOf(sourceCharRangeShape)

const highlightedFieldShape = PropTypes.oneOfType([
  highlightedTableCoordsShape,
  highlightedPolygonCoordsShape,
  highlightedTextCoordsShape,
])

export {
  HighlightedField,
  highlightedFieldShape,
  highlightedPolygonCoordsShape,
  highlightedTableCoordsShape,
  highlightedTextCoordsShape,
}

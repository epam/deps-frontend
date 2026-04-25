
import cloneDeep from 'lodash/cloneDeep'
import has from 'lodash/has'
import omit from 'lodash/omit'
import PropTypes from 'prop-types'
import { SourceBboxCoordinates, SourceTableCoordinates } from './SourceCoordinates'
import { mapSourceTableCoordinatesToTableCoordinates } from './SourceCoordinates/mappers'

class TableCoordinates {
  constructor (page, range) {
    this.page = page
    this.cellRange = range
  }

  static isValid = (coordinates) => (
    has(coordinates, 'cellRange') &&
    has(coordinates, 'page')
  )

  static getTableCoordinatesIndex = (coords, highlightedField) => {
    if (!highlightedField || !coords) {
      return 0
    }
    const nextCoordsIndex = coords.indexOf(coords.find((c) => c.cellRange === highlightedField)) + 1
    return nextCoordsIndex > 0 && nextCoordsIndex < coords.length ? nextCoordsIndex : 0
  }

  static getTablePagesFromCells = (document, cells) => (
    cells.flatMap((cell) => (
      cell.tableCoordinates ||
      cell.sourceTableCoordinates ||
      cell.sourceBboxCoordinates
    ))
      .filter((c) => !!c)
      .map((c) => (
        c.page ??
            Object.values(document.unifiedData)
              .flat()
              .find((d) => d.id === c.sourceId)
              .page
      ))
  )

  static hasCoordsType = (cells, coordsType) => (
    cells && cells.some((cell) => cell[coordsType])
  )

  static hasCoordsInCells = (cells) => (
    cells.some((cell) => (
      !!cell.sourceBboxCoordinates?.length ||
      !!cell.sourceTableCoordinates?.length ||
      !!cell.tableCoordinates?.length
    ))
  )

  static isTableHasOnePage = (cells) => {
    const pages = cells?.reduce((pages, cell) => {
      cell.tableCoordinates?.forEach((c) => pages.add(c.page))
      return pages
    }, new Set())

    return pages?.size === 1
  }

  static isTableHasOneSourceId = (cells) => {
    const ids = cells?.reduce((ids, cell) => {
      const coords = cell.sourceBboxCoordinates ?? cell.sourceTableCoordinates
      coords?.forEach((c) => ids.add(c.sourceId))
      return ids
    }, new Set())

    return ids?.size === 1
  }

  static getTableCoordsByUniquePage = (cells) => {
    if (!cells) {
      return null
    }

    const tableCoords = cells.reduce((pages, cell) => {
      const { tableCoordinates } = cloneDeep(cell)

      if (tableCoordinates?.length) {
        tableCoordinates.forEach((coord) => {
          if (pages[coord.page]) {
            pages[coord.page].cellRange[0].push(...coord.cellRange)
          } else {
            pages[coord.page] = new TableCoordinates(coord.page, [coord.cellRange])
          }
        })
      }

      return pages
    }, {})

    return Object.values(tableCoords)
  }

  static getTableCoordsByUniqueSourceId = (cells) => {
    if (!cells) {
      return null
    }

    const sourceCoords = cells.reduce((ids, cell) => {
      const { sourceBboxCoordinates, sourceTableCoordinates } = cloneDeep(cell)

      if (sourceBboxCoordinates?.length) {
        sourceBboxCoordinates.forEach((coord) => {
          if (ids[coord.sourceId]) {
            ids[coord.sourceId].bboxes[0].push(...coord.bboxes)
          } else {
            ids[coord.sourceId] = new SourceBboxCoordinates(coord.sourceId, coord.page, [coord.bboxes])
          }
        })
      }

      if (sourceTableCoordinates?.length) {
        sourceTableCoordinates.forEach((coord) => {
          if (ids[coord.sourceId]) {
            ids[coord.sourceId].cellRanges[0].push(...coord.cellRanges)
          } else {
            ids[coord.sourceId] = new SourceTableCoordinates(coord.sourceId, [coord.cellRanges])
          }
        })
      }

      return ids
    }, {})

    return Object.values(sourceCoords)
  }

  static getAllTableCoords = (data) => {
    let page
    let sourceId

    const allCoords = data.cells.reduce((coords, cell) => {
      const { sourceBboxCoordinates, sourceTableCoordinates, tableCoordinates } = cell

      if (sourceBboxCoordinates) {
        const cellCoords = sourceBboxCoordinates.flatMap((c) => c.bboxes)
        coords.push(cellCoords)
      }

      if (sourceTableCoordinates) {
        const cellCoords = sourceTableCoordinates.map((c) => c.cellRanges)
        const correctCoords = cellCoords.flat().map((c) => mapSourceTableCoordinatesToTableCoordinates(c) ?? [])
        coords.push(correctCoords)
      }

      if (!sourceTableCoordinates && tableCoordinates) {
        const cellCoords = tableCoordinates.flatMap((c) => c.cellRange)
        coords.push(cellCoords)
      }

      if (!sourceId && (sourceBboxCoordinates?.length || sourceTableCoordinates?.length)) {
        sourceId = sourceTableCoordinates?.[0]?.sourceId ?? sourceBboxCoordinates?.[0]?.sourceId
      }

      if (!page && tableCoordinates?.length) {
        page = tableCoordinates?.[0]?.page
      }

      return coords
    }, [])

    if (!allCoords.length && data.coordinates) {
      const [coords] = data.coordinates.length ? data.coordinates : [data.coordinates]
      return {
        coords: [omit(coords, 'page')],
        page: data.coordinates.page,
        sourceId,
      }
    }

    return {
      coords: allCoords.filter((c) => c?.length).flat(),
      page,
      sourceId,
    }
  }
}

const tableCoordinatesShape = PropTypes.shape({
  page: PropTypes.number.isRequired,
  cellRange: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
})

export {
  TableCoordinates,
  tableCoordinatesShape,
}


import omit from 'lodash/omit'
import PropTypes from 'prop-types'
import { useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Button } from '@/components/Button'
import { LabelingIcon } from '@/components/Icons/LabelingIcon'
import { ExtractedDataCoordsType } from '@/enums/ExtractedDataCoordsType'
import { Localization, localize } from '@/localization/i18n'
import { Document } from '@/models/Document'
import { ExtractedDataField, extractedDataFieldShape } from '@/models/ExtractedData'
import { SourceBboxCoordinates, SourceTableCoordinates, SourceTextCoordinates } from '@/models/SourceCoordinates'
import { mapSourceTableCoordinatesToTableCoordinates } from '@/models/SourceCoordinates/mappers'
import { TableCoordinates } from '@/models/TableCoordinates'
import { documentSelector } from '@/selectors/documentReviewPage'
import { Badge, Wrapper, Option, Menu } from './CoordsHighlightTrigger.styles'

// TODO: #10974
const CoordsHighlightTrigger = ({
  edField,
  setHighlightedField,
  highlightArea,
}) => {
  const document = useSelector(documentSelector)

  const isOneSourceCoordOrOnePageInEdField = useMemo(
    () => {
      const {
        sourceBboxCoordinates,
        sourceTableCoordinates,
        sourceTextCoordinates,
      } = edField.data

      return (
        (
          sourceBboxCoordinates &&
          (
            SourceBboxCoordinates.areCoordinatesFromSingleSource(sourceBboxCoordinates) ||
            SourceBboxCoordinates.isOneCoordinate(sourceBboxCoordinates)
          )
        ) ||
        (
          sourceTableCoordinates &&
          SourceTableCoordinates.isOneCoordinate(sourceTableCoordinates)
        ) ||
        (
          sourceTextCoordinates &&
          SourceTextCoordinates.isOneCoordinate(sourceTextCoordinates)
        )
      )
    }, [edField.data],
  )

  const isOnePageOrOneSourceIdInTable = useMemo(
    () => {
      const { cells, coordinates } = edField.data

      return (
        TableCoordinates.isTableHasOnePage(cells) ||
        TableCoordinates.isTableHasOneSourceId(cells) ||
        (
          cells &&
          !TableCoordinates.hasCoordsInCells(cells) &&
          coordinates
        )
      )
    }, [edField.data],
  )

  const isOneCoordOrOnePageInEdField = useMemo(
    () => {
      const {
        cells,
        coordinates,
        tableCoordinates,
        sourceBboxCoordinates,
        sourceTableCoordinates,
        sourceTextCoordinates,
      } = edField.data

      if (cells) {
        return isOnePageOrOneSourceIdInTable
      }

      if (
        sourceBboxCoordinates ||
        sourceTableCoordinates ||
        sourceTextCoordinates
      ) {
        return isOneSourceCoordOrOnePageInEdField
      }

      return (
        (!coordinates && !tableCoordinates) ||
        (
          coordinates &&
          (
            !coordinates.length ||
            coordinates.length === 1 ||
            coordinates?.every((coord, _, self) => coord.page === self[0].page)
          )
        ) ||
        (
          tableCoordinates &&
          (
            !tableCoordinates.length ||
            (tableCoordinates.length === 1 && tableCoordinates[0].cellRange?.length === 1)
          )
        )
      )
    }, [edField.data, isOnePageOrOneSourceIdInTable, isOneSourceCoordOrOnePageInEdField],
  )

  const onClickHighlight = () => {
    if (isOneCoordOrOnePageInEdField && edField.data.cells?.length) {
      const { coords, page, sourceId } = TableCoordinates.getAllTableCoords(edField.data)
      highlightArea(coords, page, sourceId)
      return
    }

    if (isOneCoordOrOnePageInEdField) {
      setHighlightedField()
    }
  }

  const optionRenderer = useCallback(
    (field, page) => ({
      content: () => (
        <Option
          key={page}
          onClick={() => highlightArea(field.coords, field.page, field.sourceId)}
        >
          {localize(Localization.OPTION_TITLE, { page })}
        </Option>
      ),
    }), [highlightArea],
  )

  const getOptionsWithSourceBboxCoordinates = useCallback(
    () => {
      const coords = edField.data.cells
        ? TableCoordinates.getTableCoordsByUniqueSourceId(edField.data.cells)
        : edField.data.sourceBboxCoordinates

      const extractedDataCoords = coords.reduce((acc, cur) => {
        const { sourceId } = cur

        const sourceCoordsIndex = acc.findIndex((coord) => coord.sourceId === sourceId)
        const page = Document.getPageBySourceId(document, sourceId)
        const bboxes = cur.bboxes.flatMap((bbox) => Array.isArray(bbox) ? bbox : [bbox])

        if (sourceCoordsIndex === -1) {
          acc.push({
            sourceId,
            coords: bboxes,
            page: page,
          })
        } else {
          acc[sourceCoordsIndex].coords.push(...bboxes)
        }
        return acc
      }, []).sort((a, b) => a.page - b.page)

      return extractedDataCoords.map((coord) => optionRenderer(coord, coord.page))
    }, [
      document,
      edField.data.cells,
      edField.data.sourceBboxCoordinates,
      optionRenderer,
    ])

  const getOptionsWithSourceTableCoordinates = useCallback(
    () => {
      const coords = edField.data.cells
        ? TableCoordinates.getTableCoordsByUniqueSourceId(edField.data.cells)
        : edField.data.sourceTableCoordinates

      const extractedDataCoords = coords.map((coordinate) => (
        coordinate.cellRanges.map((cellCoords) => ({
          coords: Array.isArray(cellCoords)
            ? cellCoords.map((c) => mapSourceTableCoordinatesToTableCoordinates(c))
            : [mapSourceTableCoordinatesToTableCoordinates(cellCoords)],
          sourceId: coordinate.sourceId,
          page: Document.getPageBySourceId(document, coordinate.sourceId),
        }))
      )).flat().sort((a, b) => a.page - b.page)

      return extractedDataCoords.map((coord) => optionRenderer(coord, coord.page))
    }, [
      document,
      edField.data.cells,
      edField.data.sourceTableCoordinates,
      optionRenderer,
    ])

  const getOptionsWithFieldCoordinates = useCallback(
    () => {
      const fieldCoordinates = edField.data.coordinates.reduce((acc, cur) => {
        const { page } = cur

        if (!acc[page]) {
          acc[page] = [omit(cur, 'page')]
        } else {
          acc[page].push(omit(cur, 'page'))
        }
        return acc
      }, {})

      return Object.entries(fieldCoordinates).map(([page, coords]) => {
        const field = {
          page,
          coords,
        }
        return optionRenderer(field, page)
      })
    }, [edField, optionRenderer],
  )

  const getOptionsWithTablesCoordinates = useCallback(
    () => {
      const coords = edField.data.cells
        ? TableCoordinates.getTableCoordsByUniquePage(edField.data.cells)
        : edField.data.tableCoordinates

      const extractedDataCoords = coords.map((cell) => (
        cell.cellRange.map((cellCoords) => ({
          coords: Array.isArray(cellCoords[0]) ? cellCoords : [cellCoords],
          page: cell.page,
        }),
        )
      )).flat().sort((a, b) => a.page - b.page)
      return extractedDataCoords.map((coord) => optionRenderer(coord, coord.page))
    }, [edField, optionRenderer],
  )

  const renderDropdownOptions = useMemo(
    () => {
      if (isOneCoordOrOnePageInEdField) {
        return []
      }

      if (
        edField.data.sourceBboxCoordinates ||
        TableCoordinates.hasCoordsType(
          edField.data.cells,
          ExtractedDataCoordsType.SOURCE_BBOX_COORDINATES,
        )
      ) {
        return getOptionsWithSourceBboxCoordinates()
      }

      if (
        edField.data.sourceTableCoordinates ||
        TableCoordinates.hasCoordsType(
          edField.data.cells,
          ExtractedDataCoordsType.SOURCE_TABLE_COORDINATES,
        )
      ) {
        return getOptionsWithSourceTableCoordinates()
      }

      if (edField.data.coordinates) {
        return getOptionsWithFieldCoordinates()
      }

      return getOptionsWithTablesCoordinates()
    },
    [
      isOneCoordOrOnePageInEdField,
      edField.data,
      getOptionsWithTablesCoordinates,
      getOptionsWithSourceBboxCoordinates,
      getOptionsWithSourceTableCoordinates,
      getOptionsWithFieldCoordinates,
    ],
  )

  if (ExtractedDataField.isNotEmptyCoords(edField)) {
    return (
      <Wrapper>
        <Badge count={renderDropdownOptions.length}>
          <Menu
            getPopupContainer={(trigger) => trigger.parentNode}
            items={renderDropdownOptions}
          >
            <Button.Icon
              icon={<LabelingIcon />}
              onClick={onClickHighlight}
            />
          </Menu>
        </Badge>
      </Wrapper>
    )
  }

  return null
}

CoordsHighlightTrigger.propTypes = {
  edField: PropTypes.oneOfType([
    extractedDataFieldShape,
    PropTypes.arrayOf(extractedDataFieldShape),
  ]).isRequired,
  highlightArea: PropTypes.func.isRequired,
  setHighlightedField: PropTypes.func.isRequired,
}

export {
  CoordsHighlightTrigger,
}

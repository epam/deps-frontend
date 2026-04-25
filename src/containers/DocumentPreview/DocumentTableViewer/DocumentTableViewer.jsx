
import PropTypes from 'prop-types'
import {
  useMemo,
  useCallback,
  useEffect,
} from 'react'
import { useDispatch } from 'react-redux'
import { fetchUnifiedDataCells } from '@/actions/documents'
import { Spin } from '@/components/Spin'
import { UnifiedDataHandsonTable } from '@/containers/UnifiedDataHandsonTable'
import { Localization, localize } from '@/localization/i18n'
import { documentShape } from '@/models/Document'
import { highlightedTableCoordsShape } from '@/models/HighlightedField'
import {
  DocumentTableViewerContainer,
  Controls,
  RightControls,
  LeftControls,
  SheetNameStyled,
} from './DocumentTableViewer.styles'

const DocumentTableViewer = ({
  activePage,
  activeSourceId,
  document,
  renderPageSwitcher,
  highlightedField,
}) => {
  const dispatch = useDispatch()

  const unifiedData = useMemo(() => {
    if (activeSourceId) {
      return Object.values(document.unifiedData).flat().find((ud) => ud.id === activeSourceId)
    }

    return Object.values(document.unifiedData).flat().find((ud) => ud.page === activePage)
  }, [activePage, activeSourceId, document.unifiedData])

  useEffect(() => {
    !unifiedData.cells && dispatch(
      fetchUnifiedDataCells({
        documentId: document._id,
        tableConfigs: [{
          tableId: unifiedData.id,
          maxRow: unifiedData.maxRow,
          maxColumn: unifiedData.maxColumn,
        }],
      }),
    )
  }, [
    dispatch,
    unifiedData.cells,
    unifiedData.id,
    unifiedData.maxRow,
    unifiedData.maxColumn,
    document._id,
  ])

  const sheetName = useMemo(() => (
    localize(Localization.TABLE_SHEET_NAME, {
      sheetName: document ? unifiedData.name : localize(Localization.UNKNOWN),
    })
  ), [document, unifiedData.name])

  const Table = useCallback(({ highlightedField }) => {
    if (!unifiedData.cells) {
      return <Spin spinning />
    }

    return (
      <UnifiedDataHandsonTable
        highlightedField={highlightedField}
        unifiedData={unifiedData}
      />
    )
  }, [unifiedData])

  return (
    <>
      <Controls>
        <LeftControls>
          <SheetNameStyled>
            {sheetName}
          </SheetNameStyled>
        </LeftControls>
        <RightControls>
          {renderPageSwitcher()}
        </RightControls>
      </Controls>
      <DocumentTableViewerContainer>
        <Table
          highlightedField={highlightedField}
        />
      </DocumentTableViewerContainer>
    </>
  )
}

DocumentTableViewer.propTypes = {
  activePage: PropTypes.number.isRequired,
  activeSourceId: PropTypes.string,
  highlightedField: highlightedTableCoordsShape,
  document: documentShape.isRequired,
  renderPageSwitcher: PropTypes.func.isRequired,
}

export {
  DocumentTableViewer,
}


import {
  useMemo,
  useCallback,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { setUi } from '@/actions/navigation'
import { useFetchFileUnifiedDataQuery } from '@/apiRTK/filesApi'
import { Spin } from '@/components/Spin'
import { UiKeys } from '@/constants/navigation'
import { ImagePageSwitcher } from '@/containers/ImagePageSwitcher'
import { Localization, localize } from '@/localization/i18n'
import { uiSelector } from '@/selectors/navigation'
import {
  FileTableViewerContainer,
  Controls,
  RightControls,
  LeftControls,
  SheetNameStyled,
} from './FileTableViewer.styles'
import { FileTableViewerWithCells } from './FileTableViewerWithCells'

const FileTableViewer = () => {
  const { fileId } = useParams()

  const dispatch = useDispatch()

  const {
    data: unifiedData,
    isLoading: isLoadingUnifiedData,
  } = useFetchFileUnifiedDataQuery(fileId)

  const activePage = useSelector(uiSelector)[UiKeys.ACTIVE_PAGE] || 1

  const activeSourceId = useSelector(uiSelector)[UiKeys.ACTIVE_SOURCE_ID]

  const onChangeActivePage = useCallback((page) => {
    dispatch(setUi({
      [UiKeys.ACTIVE_PAGE]: page,
    }))
  }, [dispatch])

  const flatUnifiedData = useMemo(() => {
    if (!unifiedData) {
      return []
    }
    return Object.values(unifiedData).flat()
  }, [unifiedData])

  const pagesQuantity = useMemo(() => {
    if (!flatUnifiedData || flatUnifiedData.length === 0) {
      return 1
    }
    return flatUnifiedData.length
  }, [flatUnifiedData])

  const currentUnifiedData = useMemo(() => {
    if (activeSourceId) {
      return flatUnifiedData.find((ud) => ud.id === activeSourceId)
    }

    return flatUnifiedData.find((ud) => ud.page === activePage)
  }, [activePage, activeSourceId, flatUnifiedData])

  const sheetName = useMemo(() => (
    localize(Localization.TABLE_SHEET_NAME, {
      sheetName: currentUnifiedData ? currentUnifiedData.name : localize(Localization.UNKNOWN),
    })
  ), [currentUnifiedData])

  const Table = useCallback(() => {
    if (isLoadingUnifiedData || !currentUnifiedData) {
      return <Spin spinning />
    }

    return (
      <FileTableViewerWithCells
        currentUnifiedData={currentUnifiedData}
      />
    )
  }, [currentUnifiedData, isLoadingUnifiedData])

  return (
    <>
      <Controls>
        <LeftControls>
          <SheetNameStyled>
            {sheetName}
          </SheetNameStyled>
        </LeftControls>
        <RightControls>
          <ImagePageSwitcher
            activePage={activePage}
            disabled={false}
            onChangeActivePage={onChangeActivePage}
            pagesQuantity={pagesQuantity}
          />
        </RightControls>
      </Controls>
      <FileTableViewerContainer>
        <Table />
      </FileTableViewerContainer>
    </>
  )
}

export {
  FileTableViewer,
}

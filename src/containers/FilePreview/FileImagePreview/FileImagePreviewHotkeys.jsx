
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { highlightPolygonCoordsField } from '@/actions/fileReviewPage'
import { useFetchFileUnifiedDataQuery } from '@/apiRTK/filesApi'
import { WindowListener } from '@/components/WindowListener'
import { UiKeys } from '@/constants/navigation'
import { KeyCode } from '@/enums/KeyCode'
import { NodeName } from '@/enums/NodeName'
import { UnifiedData } from '@/models/UnifiedData'
import { uiSelector } from '@/selectors/navigation'

const INITIAL_PAGE = 1

export const FileImagePreviewHotkeys = () => {
  const dispatch = useDispatch()

  const activePage = useSelector((state) => uiSelector(state)[UiKeys.ACTIVE_PAGE] || INITIAL_PAGE)

  const { fileId } = useParams()

  const { data: unifiedData } = useFetchFileUnifiedDataQuery(fileId)

  const pagesQuantity = useMemo(() => UnifiedData.getPagesQuantity(unifiedData), [unifiedData])

  const activePageRef = useRef(activePage)

  const pagesQuantityRef = useRef(pagesQuantity)

  useEffect(() => {
    activePageRef.current = activePage
    pagesQuantityRef.current = pagesQuantity
  }, [activePage, pagesQuantity])

  const changeActivePage = useCallback((page) => {
    dispatch(highlightPolygonCoordsField({
      page,
      unifiedData,
    }))
  }, [dispatch, unifiedData])

  const onKeyDown = useCallback((e) => {
    if (
      e.target.nodeName === NodeName.INPUT ||
      e.target.nodeName === NodeName.TEXT_AREA
    ) {
      return
    }

    const isNextPageKey = (e.shiftKey && e.keyCode === KeyCode.D) || e.keyCode === KeyCode.RIGHT_ARROW
    const isPrevPageKey = (e.shiftKey && e.keyCode === KeyCode.A) || e.keyCode === KeyCode.LEFT_ARROW

    if (isPrevPageKey && activePageRef.current !== INITIAL_PAGE) {
      e.preventDefault()
      changeActivePage(activePageRef.current - 1)
    }

    if (isNextPageKey && activePageRef.current !== pagesQuantityRef.current) {
      e.preventDefault()
      changeActivePage(activePageRef.current + 1)
    }
  }, [changeActivePage])

  return (
    <WindowListener
      onKeyDown={onKeyDown}
    />
  )
}

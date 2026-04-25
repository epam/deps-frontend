
import PropTypes from 'prop-types'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { connect } from 'react-redux'
import { highlightPolygonCoordsField } from '@/actions/documentReviewPage'
import { WindowListener } from '@/components/WindowListener'
import { UiKeys } from '@/constants/navigation'
import { KeyCode } from '@/enums/KeyCode'
import { NodeName } from '@/enums/NodeName'
import { Document, documentShape } from '@/models/Document'
import { documentSelector } from '@/selectors/documentReviewPage'
import { uiSelector } from '@/selectors/navigation'

const INITIAL_PAGE = 1

const DocumentImagePreviewHotkeys = ({
  activePage,
  document,
  highlightPolygonCoordsField,
}) => {
  const pagesQuantity = useMemo(
    () => (
      Document.getPagesQuantity(document) || 1
    ),
    [document],
  )
  const activePageRef = useRef(activePage)
  const pagesQuantityRef = useRef(pagesQuantity)

  useEffect(() => {
    activePageRef.current = activePage
    pagesQuantityRef.current = pagesQuantity
  }, [activePage, pagesQuantity])

  const changeActivePage = useCallback((page) => {
    highlightPolygonCoordsField({ page })
  }, [highlightPolygonCoordsField])

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

const mapStateToProps = (state) => ({
  activePage: uiSelector(state)[UiKeys.ACTIVE_PAGE] || INITIAL_PAGE,
  document: documentSelector(state),
})

const ConnectedComponent = connect(mapStateToProps, {
  highlightPolygonCoordsField,
})(DocumentImagePreviewHotkeys)

DocumentImagePreviewHotkeys.propTypes = {
  activePage: PropTypes.number.isRequired,
  highlightPolygonCoordsField: PropTypes.func.isRequired,
  document: documentShape.isRequired,
}

export {
  ConnectedComponent as DocumentImagePreviewHotkeys,
}


import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useFetchFileUnifiedDataQuery } from '@/apiRTK/filesApi'
import { useReviewActions } from '@/containers/ParsingLayout/hooks'
import { useLayoutData } from '../useLayoutData'

export const useHighlightCoords = () => {
  const dispatch = useDispatch()

  const { isFile, layoutId } = useLayoutData()

  const { data: unifiedData } = useFetchFileUnifiedDataQuery(layoutId, { skip: !isFile })

  const {
    highlightPolygonCoordsField,
    clearActivePolygons,
    setHighlightedField,
  } = useReviewActions()

  const highlightCoords = useCallback(({
    field,
    page,
    sourceId,
  }) => {
    dispatch(highlightPolygonCoordsField({
      field,
      page,
      sourceId,
      unifiedData,
    }))
  }, [dispatch, highlightPolygonCoordsField, unifiedData])

  const unhighlightCoords = useCallback(() => {
    dispatch(clearActivePolygons())
    dispatch(setHighlightedField(null))
  }, [dispatch, clearActivePolygons, setHighlightedField])

  return {
    highlightCoords,
    unhighlightCoords,
  }
}


import { batch } from 'react-redux'
import { createAction } from 'redux-actions'
import { setUi } from '@/actions/navigation'
import { UiKeys } from '@/constants/navigation'
import { HighlightedField } from '@/models/HighlightedField'
import { mapRectsToPolygons } from '@/models/mappers/mapRectsToPolygons'
import { UnifiedData } from '@/models/UnifiedData'

export const FEATURE_NAME = 'FILE_REVIEW_PAGE'

export const setHighlightedField = createAction(
  `${FEATURE_NAME}/SET_HIGHLIGHTED_FIELD`,
)

export const clearActivePolygons = createAction(
  `${FEATURE_NAME}/CLEAR_ACTIVE_POLYGONS`,
)

export const addActivePolygons = createAction(
  `${FEATURE_NAME}/ADD_ACTIVE_POLYGONS`,
)

export const clearFileStore = createAction(
  `${FEATURE_NAME}/CLEAR_FILE_STORE`,
)

export const highlightTableCoordsField = ({
  field,
  page,
  sourceId,
}) => (dispatch) => {
  batch(() => {
    dispatch(setUi({
      [UiKeys.ACTIVE_PAGE]: page,
      [UiKeys.ACTIVE_SOURCE_ID]: sourceId,
    }))
    dispatch(setHighlightedField(field))
    dispatch(clearActivePolygons())
  })
}

export const highlightPolygonCoordsField = ({
  field,
  page,
  sourceId,
  unifiedData,
}) => (dispatch) => {
  const activePage = page ?? UnifiedData.getPageBySourceId(unifiedData, sourceId)
  const activeSourceId = sourceId ?? UnifiedData.getBboxSourceIdByPage(unifiedData, page)
  const highlightedField = (!field || HighlightedField.arePolygonCoords(field)) ? field : mapRectsToPolygons(field)

  batch(() => {
    dispatch(setUi({
      [UiKeys.ACTIVE_PAGE]: activePage,
      [UiKeys.ACTIVE_SOURCE_ID]: activeSourceId,
    }))
    dispatch(setHighlightedField(highlightedField))
    dispatch(clearActivePolygons())
  })
}

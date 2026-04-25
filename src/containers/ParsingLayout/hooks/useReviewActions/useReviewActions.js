
import { useParams } from 'react-router'
import {
  clearActivePolygons as documentClearActivePolygons,
  addActivePolygons as documentAddActivePolygons,
  setHighlightedField as documentSetHighlightedField,
  highlightPolygonCoordsField as documentHighlightPolygonCoordsField,
  highlightTableCoordsField as documentHighlightTableCoordsField,
} from '@/actions/documentReviewPage'
import {
  clearActivePolygons as fileClearActivePolygons,
  addActivePolygons as fileAddActivePolygons,
  setHighlightedField as fileSetHighlightedField,
  highlightPolygonCoordsField as fileHighlightPolygonCoordsField,
  highlightTableCoordsField as fileHighlightTableCoordsField,
} from '@/actions/fileReviewPage'

export const useReviewActions = () => {
  const { fileId } = useParams()
  const isFile = !!fileId

  return {
    clearActivePolygons: isFile ? fileClearActivePolygons : documentClearActivePolygons,
    addActivePolygons: isFile ? fileAddActivePolygons : documentAddActivePolygons,
    setHighlightedField: isFile ? fileSetHighlightedField : documentSetHighlightedField,
    highlightPolygonCoordsField: isFile ? fileHighlightPolygonCoordsField : documentHighlightPolygonCoordsField,
    highlightTableCoordsField: isFile ? fileHighlightTableCoordsField : documentHighlightTableCoordsField,
  }
}

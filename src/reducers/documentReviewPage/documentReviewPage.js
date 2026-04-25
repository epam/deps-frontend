
import { handleActions } from 'redux-actions'
import {
  changeActiveTab,
  changeFieldsGrouping,
  setHighlightedField,
  clearDocumentStore,
  updateConfidenceView,
  addActivePolygons,
  clearActivePolygons,
  setActiveFieldTypes,
} from '@/actions/documentReviewPage'
import { storeDocument } from '@/actions/documents'
import { ACTIVE_FIELD_TYPES } from '@/constants/field'
import { ConfidenceLevel } from '@/enums/ConfidenceLevel'
import { GROUPING_TYPE } from '@/enums/GroupingTypeTabs'
import { ENV } from '@/utils/env'

const getInitialConfidenceViewFromEnvs = () => {
  if (!ENV.DEFAULT_CONFIDENCE_LEVEL_TO_DISPLAY) {
    return {
      [ConfidenceLevel.HIGH]: false,
      [ConfidenceLevel.MEDIUM]: false,
      [ConfidenceLevel.LOW]: false,
      [ConfidenceLevel.NOT_APPLICABLE]: false,
    }
  }

  return Object.values(ConfidenceLevel).reduce((acc, curr) => {
    acc[curr] = ENV.DEFAULT_CONFIDENCE_LEVEL_TO_DISPLAY.includes(curr)
    return acc
  }, {})
}

const initialState = {
  id: '',
  dataSaving: false,
  highlightedField: null,
  tabs: {
    activeTab: null,
    fieldsGrouping: GROUPING_TYPE.USER_DEFINED,
  },
  confidenceView: getInitialConfidenceViewFromEnvs(),
  activePolygons: [],
  activeFieldTypes: ACTIVE_FIELD_TYPES,
}

const setHighlightedFieldHandler = (state, action) => {
  return {
    ...state,
    highlightedField: action.payload,
  }
}

const documentReviewPageReducer = handleActions(
  new Map([
    [
      storeDocument,
      (state, { payload: document }) => {
        const documentId = document._id

        return {
          ...state,
          id: documentId,
        }
      },
    ],
    [
      changeActiveTab,
      (state, { payload }) => ({
        ...state,
        tabs: {
          ...state.tabs,
          activeTab: payload,
        },
      }),
    ],
    [
      setHighlightedField,
      setHighlightedFieldHandler,
    ],
    [
      changeFieldsGrouping,
      (state, { payload }) => ({
        ...state,
        tabs: {
          ...state.tabs,
          fieldsGrouping: payload,
        },
      }),
    ],
    [
      clearDocumentStore,
      () => initialState,
    ],
    [
      updateConfidenceView,
      (state, { payload }) => ({
        ...state,
        confidenceView: {
          ...state.confidenceView,
          ...payload,
        },
      }),
    ],
    [
      addActivePolygons,
      (state, { payload }) => ({
        ...state,
        activePolygons: [...state.activePolygons, payload],
      }),
    ],
    [
      clearActivePolygons,
      (state) => ({
        ...state,
        activePolygons: [],
      }),
    ],
    [
      setActiveFieldTypes,
      (state, { payload }) => ({
        ...state,
        activeFieldTypes: payload,
      }),
    ],
  ]),
  initialState,
)

export {
  initialState,
  documentReviewPageReducer,
}

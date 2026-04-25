
import { mockEnv } from '@/mocks/mockEnv'
import {
  clearDocumentStore,
  changeActiveTab,
  changeFieldsGrouping,
  addActivePolygons,
  clearActivePolygons,
  setActiveFieldTypes,
} from '@/actions/documentReviewPage'
import { storeDocument } from '@/actions/documents'
import { ACTIVE_FIELD_TYPES } from '@/constants/field'
import { Document } from '@/models/Document'
import { Point } from '@/models/Point'
import { documentReviewPageReducer, initialState } from '@/reducers/documentReviewPage'

jest.mock('@/utils/env', () => mockEnv)

const state = undefined
const mockPolygons = [[
  new Point(0, 0),
  new Point(0.1, 0),
  new Point(0.2, 0.21),
  new Point(0.3, 0.45),
  new Point(0.1, 0.2),
]]

describe('Reducer: documentReviewPage', () => {
  it('Action handler: clearDocumentStore', () => {
    const action = clearDocumentStore()

    expect(documentReviewPageReducer(state, action)).toEqual(initialState)
  })

  it('Action handler: storeDocument', () => {
    const mockDocument = new Document({ id: 1 })

    const action = storeDocument(mockDocument)

    const expected = {
      ...initialState,
      id: 1,
    }

    expect(documentReviewPageReducer(state, action)).toEqual(expected)
  })

  it('Action handler: changeActiveTab', () => {
    const action = changeActiveTab('mockTab')

    const expected = {
      ...initialState,
      tabs: {
        ...initialState.tabs,
        activeTab: 'mockTab',
      },
    }

    expect(documentReviewPageReducer(state, action)).toEqual(expected)
  })

  it('Action handler: changeFieldsGrouping', () => {
    const action = changeFieldsGrouping('mockGrouping')

    const expected = {
      ...initialState,
      tabs: {
        ...initialState.tabs,
        fieldsGrouping: 'mockGrouping',
      },
    }

    expect(documentReviewPageReducer(state, action)).toEqual(expected)
  })

  it('Action handler: addActivePolygons', () => {
    const action = addActivePolygons(mockPolygons[0])

    const expected = {
      ...initialState,
      activePolygons: [...initialState.activePolygons, mockPolygons[0]],
    }

    expect(documentReviewPageReducer(state, action)).toEqual(expected)
  })

  it('Action handler: clearActivePolygons', () => {
    const action = clearActivePolygons()

    const expected = {
      ...initialState,
      activePolygons: [],
    }

    expect(documentReviewPageReducer(state, action)).toEqual(expected)
  })

  it('Action handler: setActiveFieldTypes', () => {
    const action = setActiveFieldTypes(ACTIVE_FIELD_TYPES)

    const expected = {
      ...initialState,
      activeFieldTypes: ACTIVE_FIELD_TYPES,
    }

    expect(documentReviewPageReducer(state, action)).toEqual(expected)
  })
})


import { mockEnv } from '@/mocks/mockEnv'
import { ACTIVE_FIELD_TYPES } from '@/constants/field'
import { Document } from '@/models/Document'
import { DocumentType, UNKNOWN_DOCUMENT_TYPE } from '@/models/DocumentType'
import { PreviewEntity } from '@/models/PreviewEntity'
import {
  activeTabSelector,
  dataSavingSelector,
  documentReviewPageStateSelector,
  documentSelector,
  documentTypeSelector,
  fieldsGroupingSelector,
  idSelector,
  activePolygonsSelector,
  activeFieldTypesSelector,
} from './documentReviewPage'

jest.mock('@/utils/env', () => mockEnv)

describe('Selectors: documentReviewPage', () => {
  let state

  const document1 = new Document({ id: '1' })
  const document2 = new Document({ id: '2' })

  const docType1 = new DocumentType('type1', 'type1')

  beforeEach(() => {
    document1.documentType = new PreviewEntity('type1', 'type1')
    state = {
      documentReviewPage: {
        id: '1',
        dataSaving: false,
        tabs: {
          activeTab: null,
          fieldsGrouping: 'mockGroup',
        },
        activePolygons: [],
        activeFieldTypes: ACTIVE_FIELD_TYPES,
      },
      documents: {
        1: document1,
        2: document2,
      },
      documentTypesListPage: {
        ids: [
          'type1',
          'type2',
          'type3',
        ],
      },
      documentType: docType1,
    }
  })

  it('selector: documentReviewPageStateSelector', () => {
    expect(documentReviewPageStateSelector(state)).toBe(state.documentReviewPage)
  })

  it('selector: idSelector', () => {
    expect(idSelector(state)).toBe(state.documentReviewPage.id)
  })

  it('selector: documentSelector', () => {
    expect(documentSelector(state)).toBe(document1)
  })

  it('selector: dataSavingSelector', () => {
    expect(dataSavingSelector(state)).toBe(state.documentReviewPage.dataSaving)
  })

  it('selector: activeTabSelector', () => {
    expect(activeTabSelector(state)).toBe(state.documentReviewPage.tabs.activeTab)
  })

  it('selector: fieldsGroupingSelector', () => {
    expect(fieldsGroupingSelector(state)).toBe(state.documentReviewPage.tabs.fieldsGrouping)
  })

  it('selector: documentTypeSelector', () => {
    expect(documentTypeSelector(state)).toBe(docType1)
  })

  it('selector: documentTypeSelector in case of empty documentType', () => {
    state.documentType = null

    expect(documentTypeSelector(state)).toBe(UNKNOWN_DOCUMENT_TYPE)
  })

  it('selector: activePolygonsSelector', () => {
    expect(activePolygonsSelector(state)).toBe(state.documentReviewPage.activePolygons)
  })

  it('selector: activeFieldTypesSelector', () => {
    expect(activeFieldTypesSelector(state)).toBe(state.documentReviewPage.activeFieldTypes)
  })
})

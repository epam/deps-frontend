
import { mockEnv } from '@/mocks/mockEnv'
import { storeDocumentType } from '@/actions/documentType'
import { changeActiveTab } from '@/actions/documentTypePage'
import { DocumentType } from '@/models/DocumentType'
import { documentTypePageReducer, initialState } from '@/reducers/documentTypePage'

jest.mock('@/utils/env', () => mockEnv)

const state = undefined

describe('Reducer: documentTypes', () => {
  it('should save the payload as the field', () => {
    const docType = new DocumentType('code', 'Name', 'engine')
    const action = storeDocumentType(docType)

    const expected = {
      ...initialState,
      id: docType.code,
    }

    expect(documentTypePageReducer(state, action)).toEqual(expected)
  })

  it('Action handler: changeActiveTab', () => {
    const action = changeActiveTab('mockTab')

    const expected = {
      ...initialState,
      activeTab: 'mockTab',
    }

    expect(documentTypePageReducer(state, action)).toEqual(expected)
  })
})


import { mockEnv } from '@/mocks/mockEnv'
import { DocumentType } from '@/models/DocumentType'
import { documentTypesSelector } from './documentTypesListPage'

jest.mock('@/utils/env', () => mockEnv)

describe('Selectors: documentTypesListPage', () => {
  let state
  const docType1 = new DocumentType('type1', 'type1')
  const docType2 = new DocumentType('type2', 'type2')
  const docType3 = new DocumentType('type3', 'type3')

  beforeEach(() => {
    state = {
      documentTypesListPage: {
        ids: [
          'type1',
          'type2',
          'type3',
        ],
      },
      documentTypes: {
        type1: docType1,
        type2: docType2,
        type3: docType3,
      },
    }
  })

  it('selector: documentTypesSelector', () => {
    expect(documentTypesSelector(state)).toStrictEqual([docType1, docType2, docType3])
  })
})

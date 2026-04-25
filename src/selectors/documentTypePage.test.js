
import { mockEnv } from '@/mocks/mockEnv'
import { DocumentType } from '@/models/DocumentType'
import { activeTabSelector } from './documentTypePage'

jest.mock('@/utils/env', () => mockEnv)

describe('Selectors: documentTypePage', () => {
  let state

  const docType1 = new DocumentType('type1', 'type1')
  const docType2 = new DocumentType('type2', 'type2')
  const docType3 = new DocumentType('type3', 'type3')

  beforeEach(() => {
    state = {
      documentTypePage: {
        id: 'type1',
        activeTab: null,
      },
      documentTypes: {
        type1: docType1,
        type2: docType2,
        type3: docType3,
      },
    }
  })

  it('selector: activeTabSelector', () => {
    expect(activeTabSelector(state)).toBe(state.documentTypePage.activeTab)
  })
})

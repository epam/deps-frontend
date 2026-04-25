
import { mockEnv } from '@/mocks/mockEnv'
import { documentNavigationInfoSelector } from './documentNavigationInfo'

jest.mock('@/utils/env', () => mockEnv)

describe('Selectors: documentNavigationInfo', () => {
  let state

  beforeEach(() => {
    state = {
      documentNavigationInfo: {
        documentIds: ['id1, id2'],
        total: 2,
        currentDocIndex: 1,
        pagination: {
          page: 1,
          perPage: 10,
        },
      },
    }
  })

  it('selector: documentsNavigationSelector', () => {
    expect(documentNavigationInfoSelector(state)).toBe(state.documentNavigationInfo)
  })
})

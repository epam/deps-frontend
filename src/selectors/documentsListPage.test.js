
import { mockEnv } from '@/mocks/mockEnv'
import { Document } from '@/models/Document'
import {
  documentsSelector,
  documentsTotalSelector,
} from './documentsListPage'

jest.mock('@/utils/env', () => mockEnv)

describe('Selectors: documentsListPage', () => {
  let state

  const document1 = new Document({ id: '1' })
  const document2 = new Document({ id: '2' })

  beforeEach(() => {
    state = {
      documentsListPage: {
        ids: ['1'],
        total: 1,
      },
      documents: {
        1: document1,
        2: document2,
      },
    }
  })

  it('selector: documentsSelector', () => {
    expect(documentsSelector(state)).toStrictEqual([document1])
  })

  it('selector: documentsTotalSelector', () => {
    expect(documentsTotalSelector(state)).toBe(state.documentsListPage.total)
  })
})

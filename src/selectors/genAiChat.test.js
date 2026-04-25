
import { mockEnv } from '@/mocks/mockEnv'
import { Document } from '@/models/Document'
import { documentChatDialogsSelector } from './genAiChat'

jest.mock('@/utils/env', () => mockEnv)

describe('Selectors: genAiChat', () => {
  let state

  const document = new Document({ id: '1' })

  beforeEach(() => {
    state = {
      genAiChat: {
        [document._id]: [document._id],
      },
      documents: {
        1: document,
      },
      documentReviewPage: {
        id: '1',
      },
    }
  })

  it('selector: documentChatDialogsSelector', () => {
    expect(documentChatDialogsSelector(state)).toEqual([document._id])
  })
})

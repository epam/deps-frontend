
import { documentsRootStateSelector } from './documents'

describe('Selectors: documents', () => {
  let state

  beforeEach(() => {
    state = {
      documents: 'mockDocuments',
    }
  })

  it('selector: documentsRootStateSelector', () => {
    expect(documentsRootStateSelector(state)).toBe(state.documents)
  })
})

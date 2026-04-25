
import { documentTypesStateSelector } from './documentTypes'

describe('Selectors: documentTypes', () => {
  let state

  beforeEach(() => {
    state = {
      documentTypes: 'mockDocumentTypes',
    }
  })

  it('selector: documentTypesStateSelector', () => {
    expect(documentTypesStateSelector(state)).toBe(state.documentTypes)
  })
})

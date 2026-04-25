
import { documentTypeStateSelector } from './documentType'

test('selector documentTypeStateSelector returns correct state', () => {
  const state = {
    documentType: 'mockDocumentType',
  }

  expect(documentTypeStateSelector(state)).toBe(state.documentType)
})

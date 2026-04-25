
import { mockDocumentType } from '@/mocks/mockDocumentType'
import { mockSelector } from '@/mocks/mockSelector'

const documentTypesStateSelector = mockSelector({
  [mockDocumentType.code]: mockDocumentType,
})

export {
  documentTypesStateSelector,
}

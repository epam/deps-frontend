
import { mockSelector } from '@/mocks/mockSelector'
import { ExtractionType } from '@/enums/ExtractionType'
import { DocumentType } from '@/models/DocumentType'

const documentTypesSelector = mockSelector([
  new DocumentType('testType1', 'Test Type 1', 'Test Engine Code 1', 'Test Language Code 1', ExtractionType.ML, [], 'id1'),
  new DocumentType('testType2', 'Test Type 2', 'Test Engine Code 2', 'Test Language Code 2', ExtractionType.TEMPLATE, [], 'id2'),
])

export {
  documentTypesSelector,
}

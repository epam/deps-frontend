
import { mockSelector } from '@/mocks/mockSelector'
import { DocumentState } from '@/enums/DocumentState'
import { DocumentReviewer } from '@/models/DocumentReviewer'

export const documentsSelector = mockSelector([{
  id: 'mockId',
  documentType: null,
  files: [{
    blobName: '',
  }],
  reviewer: new DocumentReviewer({
    id: '123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Smith',
  }),
  state: DocumentState.COMPLETED,
}])

export const documentsIdsSelector = mockSelector([
  '1', '2',
])

export const documentsTotalSelector = mockSelector(1)

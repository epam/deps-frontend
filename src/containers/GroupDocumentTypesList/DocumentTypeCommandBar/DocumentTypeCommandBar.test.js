
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { Modal } from '@/components/Modal'
import { ExtractionType } from '@/enums/ExtractionType'
import { render } from '@/utils/rendererRTL'
import { GroupDocumentType } from '../GroupDocumentType'
import { DocumentTypeCommandBar } from './DocumentTypeCommandBar'

jest.mock('@/components/Icons/TrashIcon', () => ({
  TrashIcon: () => <div data-testid={deleteIconId} />,
}))

jest.mock('@/utils/env', () => mockEnv)

Modal.confirm = jest.fn()

const deleteIconId = 'trash-icon'

const mockDocumentType = new GroupDocumentType({
  id: 'id',
  groupId: 'groupId',
  name: 'group',
  extractionType: ExtractionType.TEMPLATE,
})

test('renders command bar correctly', async () => {
  const props = {
    documentType: mockDocumentType,
  }

  render(<DocumentTypeCommandBar {...props} />)

  const deleteCommand = screen.getByTestId(deleteIconId)

  expect(deleteCommand).toBeInTheDocument()
})

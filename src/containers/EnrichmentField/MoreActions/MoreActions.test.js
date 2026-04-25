
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { DocumentSupplement } from '@/models/DocumentSupplement'
import { DocumentTypeExtraField } from '@/models/DocumentTypeExtraField'
import { render } from '@/utils/rendererRTL'
import { MoreActions } from './MoreActions'

jest.mock('@/utils/env', () => mockEnv)

const mockExtraField = new DocumentTypeExtraField({
  code: 'mockExtraFieldCode',
  name: 'mockExtraFieldName',
  order: 0,
})

const mockSupplement = new DocumentSupplement({
  code: 'mockSupplementCode',
  name: 'mockSupplementName',
  type: FieldType.STRING,
  value: 'mockSupplementValue',
})

const mockDocumentSupplements = [mockSupplement]
const mockDocumentId = 'documentId'
const mockDocumentTypeCode = 'DocTypeCode'

const mockIconContent = 'MoreIcon'

jest.mock('@/components/Icons/MoreIcon', () => ({
  MoreIcon: () => mockIconContent,
}))

test('renders delete field button within a dropdown menu', async () => {
  render(
    <MoreActions
      disabled={false}
      documentId={mockDocumentId}
      documentSupplements={mockDocumentSupplements}
      documentTypeCode={mockDocumentTypeCode}
      extraField={mockExtraField}
      supplement={mockSupplement}
    />,
  )

  const moreButton = screen.getByRole('button')
  await userEvent.click(moreButton)

  const actionsMenu = screen.getByRole('menu')
  const deleteButton = screen.getByRole('button', {
    name: localize(Localization.DELETE),
  })

  expect(actionsMenu).toBeInTheDocument()
  expect(deleteButton).toBeInTheDocument()
})

test('disables actions menu if disabled prop is true', async () => {
  render(
    <MoreActions
      disabled={true}
      documentId={mockDocumentId}
      documentSupplements={mockDocumentSupplements}
      documentTypeCode={mockDocumentTypeCode}
      extraField={mockExtraField}
      supplement={mockSupplement}
    />,
  )

  const moreButton = screen.getByRole('button')

  expect(moreButton).toBeDisabled()
})

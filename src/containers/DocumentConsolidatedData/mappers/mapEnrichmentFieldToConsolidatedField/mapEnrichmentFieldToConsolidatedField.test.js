
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/dom'
import { DocumentConsolidatedField } from '@/containers/DocumentConsolidatedData/DocumentConsolidatedField'
import { DocumentState } from '@/enums/DocumentState'
import { FieldType } from '@/enums/FieldType'
import { DocumentSupplement } from '@/models/DocumentSupplement'
import { DocumentTypeExtraField } from '@/models/DocumentTypeExtraField'
import { render } from '@/utils/rendererRTL'
import { mapEnrichmentFieldToConsolidatedField } from './mapEnrichmentFieldToConsolidatedField'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Icons/MoreIcon', () => ({
  MoreIcon: () => mockIconContent,
}))

const mockIconContent = 'MoreIcon'

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

const mockDocumentTypeCode = 'code'
const mockDocumentId = 'id'

test('return correct result', () => {
  const args = {
    field: mockExtraField,
    documentState: DocumentState.COMPLETED,
    documentId: mockDocumentId,
    documentTypeCode: mockDocumentTypeCode,
    documentSupplements: [mockSupplement],
    documentTypeExtraFields: [mockExtraField],
  }

  const result = mapEnrichmentFieldToConsolidatedField(args)

  expect(result).toEqual(
    new DocumentConsolidatedField({
      code: mockExtraField.code,
      name: mockExtraField.name,
      order: mockExtraField.order,
      type: mockExtraField.type,
      render: expect.any(Function),
    }),
  )
})

test('renders enrichment field when call render method', async () => {
  const args = {
    field: mockExtraField,
    documentState: DocumentState.IN_REVIEW,
    documentId: mockDocumentId,
    documentTypeCode: mockDocumentTypeCode,
    documentSupplements: [mockSupplement],
    documentTypeExtraFields: [mockExtraField],
  }

  const result = mapEnrichmentFieldToConsolidatedField(args)

  render(<div>{result.render()}</div>)

  await waitFor(() => {
    expect(screen.getByText(mockExtraField.name)).toBeInTheDocument()
  })
})

test('render disabled enrichment field and actions button if document state is not in review', async () => {
  const args = {
    field: mockExtraField,
    documentState: DocumentState.COMPLETED,
    documentId: mockDocumentId,
    documentTypeCode: mockDocumentTypeCode,
    documentSupplements: [mockSupplement],
    documentTypeExtraFields: [mockExtraField],
  }

  const result = mapEnrichmentFieldToConsolidatedField(args)

  render(<div>{result.render()}</div>)

  const moreButton = screen.getByRole('button')

  await waitFor(() => {
    expect(moreButton).toBeDisabled()
  })
})

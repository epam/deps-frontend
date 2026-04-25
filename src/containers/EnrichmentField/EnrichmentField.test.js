
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { DocumentSupplement } from '@/models/DocumentSupplement'
import { DocumentTypeExtraField } from '@/models/DocumentTypeExtraField'
import { notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { EnrichmentField } from './EnrichmentField'

jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/utils/env', () => mockEnv)

const mockIconContent = 'MoreIcon'

jest.mock('@/components/Icons/MoreIcon', () => ({
  MoreIcon: () => mockIconContent,
}))

jest.mock('@/hooks/useExpandableText', () => ({
  useExpandableText: jest.fn(() => ({
    ExpandableContainer: ({ children }) => <div>{children}</div>,
    ToggleExpandIcon: () => 'mockIcon',
  })),
}))

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

const mockCreateOrUpdateSupplementsFn = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve({})),
}))

jest.mock('@/apiRTK/documentSupplementsApi', () => ({
  useCreateOrUpdateSupplementsMutation: jest.fn(() => ([
    mockCreateOrUpdateSupplementsFn,
    { isLoading: false },
  ])),
}))

test('shows field layout correctly if extra field was passed but there is no supplement', async () => {
  render(
    <EnrichmentField
      disabled={false}
      documentId={mockDocumentId}
      documentSupplements={mockDocumentSupplements}
      documentTypeCode={mockDocumentTypeCode}
      extraField={mockExtraField}
    />,
  )

  const moreActionsButton = screen.getByRole('button')

  const fieldLabel = screen.getByText(mockExtraField.name)
  const fieldInput = screen.getByRole('textbox')

  expect(moreActionsButton).toBeInTheDocument()
  expect(fieldLabel).toBeInTheDocument()

  await waitFor(() => {
    expect(fieldInput.value).toBe('')
  })
})

test('shows disabled text input if extra field is autofilled', async () => {
  const mockAutoFilledExtraField = {
    ...mockExtraField,
    autoFilled: true,
  }

  render(
    <EnrichmentField
      disabled={false}
      documentId={mockDocumentId}
      documentSupplements={mockDocumentSupplements}
      documentTypeCode={mockDocumentTypeCode}
      extraField={mockAutoFilledExtraField}
    />,
  )

  await waitFor(() => {
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
})

test('shows disabled text input if passed disabled prop is true', async () => {
  jest.clearAllMocks()

  render(
    <EnrichmentField
      disabled={true}
      documentId={mockDocumentId}
      documentSupplements={mockDocumentSupplements}
      documentTypeCode={mockDocumentTypeCode}
      extraField={mockExtraField}
    />,
  )

  await waitFor(() => {
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
})

test('shows field layout correctly if supplement was passed but there is no extra field', async () => {
  render(
    <EnrichmentField
      disabled={false}
      documentId={mockDocumentId}
      documentSupplements={mockDocumentSupplements}
      documentTypeCode={mockDocumentTypeCode}
      supplement={mockSupplement}
    />,
  )

  await waitFor(() => {
    expect(screen.getByText(mockSupplement.name)).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.getByRole('textbox').value).toBe(mockSupplement.value)
  })
})

test('shows field layout correctly if extra field and supplement are passed', async () => {
  render(
    <EnrichmentField
      disabled={false}
      documentId={mockDocumentId}
      documentSupplements={mockDocumentSupplements}
      documentTypeCode={mockDocumentTypeCode}
      extraField={mockExtraField}
      supplement={mockSupplement}
    />,
  )

  await waitFor(() => {
    expect(screen.getByText(mockExtraField.name)).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.getByRole('textbox').value).toBe(mockSupplement.value)
  })
})

test('calls update supplements api with correct arguments on field change', async () => {
  render(
    <EnrichmentField
      disabled={false}
      documentId={mockDocumentId}
      documentSupplements={mockDocumentSupplements}
      documentTypeCode={mockDocumentTypeCode}
      supplement={mockSupplement}
    />,
  )

  const field = screen.getByRole('textbox')
  const mockNewValue = 'newVal'

  fireEvent.change(field, { target: { value: mockNewValue } })
  fireEvent.blur(field)

  await waitFor(() => {
    expect(mockCreateOrUpdateSupplementsFn).nthCalledWith(1, {
      documentId: mockDocumentId,
      documentTypeId: mockDocumentTypeCode,
      data: [{
        ...mockSupplement,
        value: mockNewValue,
      }],
    })
  })
})

test('shows an error if update supplements fails', async () => {
  jest.clearAllMocks()

  const mockError = new Error('')
  mockCreateOrUpdateSupplementsFn.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(mockError)),
  }))

  render(
    <EnrichmentField
      disabled={false}
      documentId={mockDocumentId}
      documentSupplements={mockDocumentSupplements}
      documentTypeCode={mockDocumentTypeCode}
      supplement={mockSupplement}
    />,
  )

  const field = screen.getByRole('textbox')
  const mockNewValue = 'newVal'

  fireEvent.change(field, { target: { value: mockNewValue } })
  fireEvent.blur(field)

  await waitFor(() => {
    expect(notifyWarning).nthCalledWith(1, localize(Localization.DEFAULT_ERROR))
  })
})

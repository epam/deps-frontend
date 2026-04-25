
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/dom'
import { FieldAdapter } from '@/containers/FieldAdapter'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { DocumentSupplement } from '@/models/DocumentSupplement'
import { DocumentTypeExtraField } from '@/models/DocumentTypeExtraField'
import { activeFieldTypesSelector, documentTypeSelector } from '@/selectors/documentReviewPage'
import { render } from '@/utils/rendererRTL'
import { DocumentConsolidatedDataFields } from './DocumentConsolidatedDataFields'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/selectors/navigation')

jest.mock('@/containers/FieldAdapter', () => ({
  FieldAdapter: jest.fn(({ dtField }) => (
    <div>{dtField.name}</div>
  )),
}))

jest.mock('@/components/Icons/MoreIcon', () => ({
  MoreIcon: () => mockIconContent,
}))

console.error = jest.fn()

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

const defaultActiveFieldTypes = activeFieldTypesSelector.getSelectorMockValue()

const defaultDocumentType = {
  ...documentTypeSelector.getSelectorMockValue(),
  extraFields: [mockExtraField],
  llmExtractors: [],
}
documentTypeSelector.mockImplementation(() => defaultDocumentType)

test('render DocumentConsolidatedFields correctly', async () => {
  const props = {
    documentSupplements: [mockSupplement],
  }

  render(<DocumentConsolidatedDataFields {...props} />)

  await waitFor(() => {
    expect(screen.getByText(mockSupplement.name)).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.getByText(mockExtraField.name)).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.getByText(documentTypeSelector.getSelectorMockValue().fields[0].name))
  })
})

test('render sorted fields according to their order', async () => {
  const mockFields = [
    new DocumentTypeExtraField({
      code: 'mockExtraFieldCode2',
      name: 'mockExtraFieldName2',
      order: 2,
    }),
    mockExtraField,
    new DocumentTypeExtraField({
      code: 'mockExtraFieldCode1',
      name: 'mockExtraFieldName1',
      order: 1,
    }),
  ]

  const expectedFields = [
    mockExtraField,
    new DocumentTypeExtraField({
      code: 'mockExtraFieldCode1',
      name: 'mockExtraFieldName1',
      order: 1,
    }),
    new DocumentTypeExtraField({
      code: 'mockExtraFieldCode2',
      name: 'mockExtraFieldName2',
      order: 2,
    }),
  ]

  documentTypeSelector.mockImplementation(() => ({
    ...defaultDocumentType,
    extraFields: mockFields,
  }))

  const props = {
    documentSupplements: [],
  }

  render(<DocumentConsolidatedDataFields {...props} />)

  const extraFields = await screen.findAllByText(mockExtraField.name, { exact: false })

  extraFields.forEach((field, index) => {
    expect(field).toHaveTextContent(expectedFields[index].name)
  })

  documentTypeSelector.mockImplementation(() => defaultDocumentType)
})

test('render ErrorBoundary if catch an error in the field', async () => {
  const props = {
    documentSupplements: [mockSupplement],
  }

  const [firstField] = documentTypeSelector.getSelectorMockValue().fields

  FieldAdapter.mockImplementationOnce(() => {
    throw new Error('err')
  })

  render(<DocumentConsolidatedDataFields {...props} />)

  await waitFor(() => {
    expect(screen.getByText(
      localize(Localization.LOCAL_BOUNDARY_TITLE, {
        fieldCode: firstField.code,
        fieldName: firstField.name,
      }))).toBeInTheDocument()
  })
})

test('only shows fields with a type present in activeFieldTypes', async () => {
  const props = {
    documentSupplements: [mockSupplement],
  }

  activeFieldTypesSelector.mockImplementation(() => [FieldType.DATE])

  render(<DocumentConsolidatedDataFields {...props} />)

  expect(screen.queryByText(mockSupplement.name)).not.toBeInTheDocument()

  activeFieldTypesSelector.mockImplementation(() => defaultActiveFieldTypes)
})

test('shows no data content if no fields to display', async () => {
  documentTypeSelector.mockImplementation(() => ({
    ...defaultDocumentType,
    fields: [],
    extraFields: [],
    llmExtractors: [],
  }))

  const props = {
    documentSupplements: [],
  }

  render(<DocumentConsolidatedDataFields {...props} />)

  const noDataText = localize(Localization.NOTHING_TO_DISPLAY)

  expect(screen.getByText(noDataText)).toBeInTheDocument()

  documentTypeSelector.mockImplementation(() => defaultDocumentType)
})

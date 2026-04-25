
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useDispatch } from 'react-redux'
import { saveExtractedDataField } from '@/actions/documentReviewPage'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { ListFieldMeta } from '@/models/DocumentTypeFieldMeta'
import { ExtractedDataField, FieldData } from '@/models/ExtractedData'
import { FieldCoordinates } from '@/models/FieldCoordinates'
import { render } from '@/utils/rendererRTL'
import { DeleteSubFieldButton } from './DeleteSubFieldButton'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}))

jest.mock('@/actions/documentReviewPage', () => ({
  saveExtractedDataField: jest.fn(),
}))

const mockDtField = new DocumentTypeField(
  'listStrs',
  'list Strs',
  new ListFieldMeta(FieldType.STRING),
  FieldType.LIST,
  false,
  0,
  'whole',
  12345,
)

const mockSubFieldId = 'subFieldId'
const mockDocumentId = 'mockDocumentId'

const mockFieldData1 = new FieldData(
  'Confirm before collaction',
  new FieldCoordinates(
    2,
    0.524590163934,
    0.364864406204,
    0.15,
    0.041365441401,
  ),
  null,
  null,
  0,
  null,
  null,
  null,
  null,
  null,
  mockSubFieldId,
)

const mockFieldData2 = new FieldData(
  'Confirm before collaction',
  new FieldCoordinates(
    2,
    0.524590163934,
    0.364864406204,
    0.15,
    0.041365441401,
  ),
  null,
  null,
  1,
  null,
  null,
  null,
  null,
  null,
)

const mockEdField = new ExtractedDataField(
  12345,
  [
    mockFieldData1,
    mockFieldData2,
  ],
  null,
  {
    [mockSubFieldId]: 'list Strs - Sub field 1 - Alias',
  },
)

const mockSetField = jest.fn()
jest.mock('@/containers/FieldAdapter/useFieldProps', () => ({
  useFieldProps: jest.fn(() => ({
    setField: mockSetField,
  })),
}))

test('deletes sub field on button click ', async () => {
  const dispatch = jest.fn()
  useDispatch.mockReturnValue(dispatch)

  render(
    <DeleteSubFieldButton
      documentId={mockDocumentId}
      dtField={mockDtField}
      edField={mockEdField}
      fieldToDeleteIndex={0}
    />,
  )

  const deleteFieldButton = screen.getByRole('button', {
    name: localize(Localization.DELETE_FIELD),
  })

  await userEvent.click(deleteFieldButton)

  const updatedEdField = {
    ...mockEdField,
    aliases: {},
    data: [mockFieldData2],
  }

  expect(mockSetField).nthCalledWith(1, updatedEdField)
  expect(dispatch).nthCalledWith(1, saveExtractedDataField())
  expect(saveExtractedDataField).nthCalledWith(1, {
    aliases: {},
    data: updatedEdField.data,
    fieldPk: updatedEdField.fieldPk,
    documentPk: mockDocumentId,
  })
})

test('reverts deleted sub field if save action failed', async () => {
  jest.clearAllMocks()

  const dispatch = jest.fn(() => {
    throw new Error('Test error')
  })
  useDispatch.mockReturnValueOnce(dispatch)

  render(
    <DeleteSubFieldButton
      documentId={mockDocumentId}
      dtField={mockDtField}
      edField={mockEdField}
      fieldToDeleteIndex={0}
    />,
  )

  const deleteFieldButton = screen.getByRole('button', {
    name: localize(Localization.DELETE_FIELD),
  })

  await userEvent.click(deleteFieldButton)

  expect(mockSetField).toHaveBeenCalledWith(mockEdField)
})

test('shows disabled button and correct tooltip text if it is the last list item', async () => {
  const mockEdField = new ExtractedDataField(
    1,
    [mockFieldData1],
    null,
  )

  render(
    <DeleteSubFieldButton
      documentId={mockDocumentId}
      dtField={mockDtField}
      edField={mockEdField}
      fieldToDeleteIndex={0}
    />,
  )

  const deleteFieldButton = screen.getByRole('button', {
    name: localize(Localization.DELETE_FIELD),
  })

  expect(deleteFieldButton).toBeDisabled()

  await userEvent.hover(deleteFieldButton)

  await waitFor(() => {
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent(localize(Localization.REMOVE_LAST_LIST_ITEM_TEXT))
  })
})

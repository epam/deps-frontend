
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
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
import { AddSubFieldButton } from './AddSubFieldButton'

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
  730,
)

const mockSubFieldId = 'subFieldId'
const mockDocumentId = 'mockDocumentId'
const mockEdField = new ExtractedDataField(
  730,
  [
    new FieldData(
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
    ),
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

test('adds new sub field on icon button click ', async () => {
  const dispatch = jest.fn()
  useDispatch.mockReturnValue(dispatch)

  render(
    <AddSubFieldButton
      disabled={false}
      documentId={mockDocumentId}
      dtField={mockDtField}
      edField={mockEdField}
    />,
  )

  const addFieldButton = screen.getByRole('button', {
    name: localize(Localization.ADD_FIELD),
  })

  const newEdField = {
    ...mockEdField,
    data: [
      ...mockEdField.data,
      {
        ...new FieldData(),
        index: mockEdField.data.length,
      },
    ],
  }

  await userEvent.click(addFieldButton)

  expect(mockSetField).nthCalledWith(1, newEdField)
  expect(dispatch).nthCalledWith(1, saveExtractedDataField())
  expect(saveExtractedDataField).nthCalledWith(1, {
    aliases: newEdField.aliases,
    data: newEdField.data,
    fieldPk: newEdField.fieldPk,
    documentPk: mockDocumentId,
  })
})

test('reverts added sub field if save action failed', async () => {
  jest.clearAllMocks()

  const dispatch = jest.fn(() => {
    throw new Error('Test error')
  })
  useDispatch.mockReturnValueOnce(dispatch)

  render(
    <AddSubFieldButton
      disabled={false}
      documentId={mockDocumentId}
      dtField={mockDtField}
      edField={mockEdField}
    />,
  )

  const addFieldButton = screen.getByRole('button', {
    name: localize(Localization.ADD_FIELD),
  })

  await userEvent.click(addFieldButton)

  expect(mockSetField).toHaveBeenCalledWith(mockEdField)
})

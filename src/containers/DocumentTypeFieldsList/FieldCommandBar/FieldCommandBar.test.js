
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fetchDocumentType } from '@/actions/documentType'
import { DocumentTypeExtras } from '@/enums/DocumentTypeExtras'
import { DocumentTypeFieldCategory } from '@/enums/DocumentTypeFieldCategory'
import { FieldType } from '@/enums/FieldType'
import { DocumentTypeExtraField } from '@/models/DocumentTypeExtraField'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { render } from '@/utils/rendererRTL'
import { FieldCommandBar } from './FieldCommandBar'

jest.mock('@/utils/env', () => mockEnv)

const editExtractionFieldButtonTestId = 'edit-extraction-field'
const editExtraFieldButtonTestId = 'edit-extra-field'
const editGenAiFieldButtonTestId = 'edit-genAi-field'
const deleteExtraFieldButtonTestId = 'delete-extra-field'
const deleteExtractionFieldButtonTestId = 'delete-extraction-field'

jest.mock('@/containers/EditGenAIDrivenFieldModalButton', () => ({
  EditGenAIDrivenFieldModalButton: ({ onAfterEditing }) => (
    <button
      data-testid={editGenAiFieldButtonTestId}
      onClick={onAfterEditing}
    />
  ),
}))

jest.mock('@/containers/EditExtraFieldDrawerButton', () => ({
  EditExtraFieldDrawerButton: ({ onAfterEditing }) => (
    <button
      data-testid={editExtraFieldButtonTestId}
      onClick={onAfterEditing}
    />
  ),
}))

jest.mock('@/containers/EditExtractionFieldDrawerButton', () => ({
  EditExtractionFieldDrawerButton: ({ onAfterEditing }) => (
    <button
      data-testid={editExtractionFieldButtonTestId}
      onClick={onAfterEditing}
    />
  ),
}))

jest.mock('@/containers/DeleteExtractionFieldModalButton', () => ({
  DeleteExtractionFieldModalButton: ({ onAfterDelete }) => (
    <button
      data-testid={deleteExtractionFieldButtonTestId}
      onClick={onAfterDelete}
    />
  ),
}))

jest.mock('@/containers/DeleteExtraFieldModalButton', () => ({
  DeleteExtraFieldModalButton: ({ onAfterDelete }) => (
    <button
      data-testid={deleteExtraFieldButtonTestId}
      onClick={onAfterDelete}
    />
  ),
}))

jest.mock('@/actions/documentType', () => ({
  fetchDocumentType: jest.fn(() => ({ type: 'mockType' })),
}))

const mockDocumentTypeCode = 'DocType1'

const mockExtraField = new DocumentTypeExtraField({
  code: 'mockCode1',
  name: 'mockName1',
  order: 0,
})

const mockExtractionField = new DocumentTypeField(
  'docTypeCode1',
  'docTypeName2',
  {},
  FieldType.STRING,
  false,
  1,
  mockDocumentTypeCode,
  1,
)

const mockExtractionFieldWihPrompt = new DocumentTypeField(
  'docTypeCode2',
  'docTypeName2',
  {},
  FieldType.STRING,
  false,
  2,
  mockDocumentTypeCode,
  2,
  undefined,
  undefined,
)

beforeEach(() => {
  jest.clearAllMocks()
})

test('shows correct commands for field with category "Extraction"', async () => {
  render(
    <FieldCommandBar
      category={DocumentTypeFieldCategory.EXTRACTION}
      documentTypeCode={mockDocumentTypeCode}
      field={mockExtractionField}
    />,
  )

  const editExtractionFieldButton = screen.getByTestId(editExtractionFieldButtonTestId)
  const deleteExtractionFieldButton = screen.getByTestId(deleteExtractionFieldButtonTestId)

  expect(editExtractionFieldButton).toBeInTheDocument()
  expect(deleteExtractionFieldButton).toBeInTheDocument()

  await userEvent.click(editExtractionFieldButton)
  await userEvent.click(deleteExtractionFieldButton)

  expect(fetchDocumentType).toHaveBeenCalledWith(
    mockDocumentTypeCode,
    [DocumentTypeExtras.EXTRACTION_FIELDS],
  )
  expect(fetchDocumentType).toHaveBeenCalledTimes(2)
})

test('shows correct commands for field with category "Extra"', async () => {
  render(
    <FieldCommandBar
      category={DocumentTypeFieldCategory.EXTRA}
      documentTypeCode={mockDocumentTypeCode}
      field={mockExtraField}
    />,
  )

  const editExtraFieldButton = screen.getByTestId(editExtraFieldButtonTestId)
  const deleteExtraFieldButton = screen.getByTestId(deleteExtraFieldButtonTestId)

  expect(editExtraFieldButton).toBeInTheDocument()
  expect(deleteExtraFieldButton).toBeInTheDocument()

  await userEvent.click(deleteExtraFieldButton)
  await userEvent.click(editExtraFieldButton)

  expect(fetchDocumentType).toHaveBeenCalledWith(
    mockDocumentTypeCode,
    [DocumentTypeExtras.EXTRA_FIELDS],
  )
  expect(fetchDocumentType).toHaveBeenCalledTimes(2)
})

test('shows correct commands for field with category "GenAi"', async () => {
  render(
    <FieldCommandBar
      category={DocumentTypeFieldCategory.GEN_AI}
      documentTypeCode={mockDocumentTypeCode}
      field={mockExtractionFieldWihPrompt}
    />,
  )

  const editGenAiFieldButton = screen.getByTestId(editGenAiFieldButtonTestId)
  const deleteExtractionFieldButton = screen.getByTestId(deleteExtractionFieldButtonTestId)

  expect(editGenAiFieldButton).toBeInTheDocument()
  expect(deleteExtractionFieldButton).toBeInTheDocument()

  await userEvent.click(editGenAiFieldButton)
  await userEvent.click(deleteExtractionFieldButton)

  expect(fetchDocumentType).toHaveBeenCalledWith(
    mockDocumentTypeCode,
    [
      DocumentTypeExtras.EXTRACTION_FIELDS,
      DocumentTypeExtras.LLM_EXTRACTORS,
    ],
  )
  expect(fetchDocumentType).toHaveBeenCalledTimes(2)
})

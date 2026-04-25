
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { GenAiClassifier } from '@/models/DocumentTypesGroup'
import { render } from '@/utils/rendererRTL'
import { DocumentTypeClassifier } from './DocumentTypeClassifier'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('../AddClassifierDrawerButton', () => mockComponent('AddClassifierDrawerButton'))
jest.mock('../EditClassifierDrawerButton', () => mockComponent('EditClassifierDrawerButton'))

const mockDocumentTypeId = 'mockDocumentTypeId'
const mockGenAiClassifier = new GenAiClassifier({
  genAiClassifierId: 'genAiClassifierId',
  documentTypeId: mockDocumentTypeId,
  name: 'Classifier Name',
  llmType: 'Test Classifier Llm',
  prompt: 'Test Classifier Prompt',
})

test('shows classifier name and edit button if classifier exists', () => {
  render(
    <DocumentTypeClassifier
      classifier={mockGenAiClassifier}
      documentTypeId={mockDocumentTypeId}
    />,
  )

  const editClassifierButton = screen.getByText('EditClassifierDrawerButton')
  const classifierName = screen.getByText(mockGenAiClassifier.name)

  expect(editClassifierButton).toBeInTheDocument()
  expect(classifierName).toBeInTheDocument()
})

test('shows button to add classifier if classifier does not exist', () => {
  render(
    <DocumentTypeClassifier
      documentTypeId={mockDocumentTypeId}
    />,
  )

  const button = screen.getByText('AddClassifierDrawerButton')

  expect(button).toBeInTheDocument()
})

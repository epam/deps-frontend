
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen } from '@testing-library/dom'
import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { Localization, localize } from '@/localization/i18n'
import { DocumentTypesGroup, GenAiClassifier } from '@/models/DocumentTypesGroup'
import { render } from '@/utils/rendererRTL'
import { GenAiClassifierDrawer } from './GenAiClassifierDrawer'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('../GenAiClassifierForm', () => mockComponent('GenAiClassifierForm'))

jest.mock('react-router', () => ({
  useParams: jest.fn(() => ({
    groupId: mockGroupId,
  })),
}))

jest.mock('@/apiRTK/documentTypesGroupsApi', () => ({
  useFetchDocumentTypesGroupState: jest.fn(() => ({
    data: { group: mockGroup },
  })),
}))

jest.mock('react-hook-form', () => ({
  ...mockReactHookForm,
  useForm: jest.fn(() => ({
    getValues: jest.fn(() => mockFormValues),
    setValue: mockSetValue,
    formState: {
      isValid: true,
      isDirty: true,
    },
  })),
}))

const mockSetValue = jest.fn()

const mockTrigger = (onClick) => (
  <button
    data-testid='drawer-trigger'
    onClick={onClick}
  />
)

const mockGroupId = 'groupId'

const mockGroup = new DocumentTypesGroup({
  id: 'id1',
  name: 'Group1',
  documentTypeIds: ['id1', 'id2'],
  createdAt: '2012-12-12',
  genAiClassifiers: [],
})

const mockClassifier = new GenAiClassifier({
  genAiClassifierId: 'genAiClassifierId1',
  documentTypeId: 'id1',
  name: 'Classifier Name',
  llmType: 'Test llm',
  prompt: 'Test prompt',
})

const mockFormValues = {
  name: mockClassifier.name,
  llmType: mockClassifier.llmType,
  prompt: mockClassifier.prompt,
}

const [mockDocTypeId] = mockGroup.documentTypeIds

test('shows drawer on trigger click', async () => {
  render(
    <GenAiClassifierDrawer
      documentTypeId={mockDocTypeId}
      isLoading={false}
      onSubmit={jest.fn()}
      renderTrigger={mockTrigger}
    />,
  )

  const trigger = screen.getByTestId('drawer-trigger')
  await userEvent.click(trigger)

  const drawer = screen.getByTestId('drawer')

  expect(drawer).toBeInTheDocument()
  expect(drawer).toHaveTextContent(localize(Localization.ADD_CLASSIFIER))
})

test('closes drawer on cancel button click', async () => {
  render(
    <GenAiClassifierDrawer
      documentTypeId={mockDocTypeId}
      isLoading={false}
      onSubmit={jest.fn()}
      renderTrigger={mockTrigger}
    />,
  )

  const trigger = screen.getByTestId('drawer-trigger')
  await userEvent.click(trigger)

  const cancelButton = screen.getByRole('button', {
    name: localize(Localization.CANCEL),
  })
  await userEvent.click(cancelButton)

  const drawer = screen.queryByTestId('drawer')

  expect(drawer).not.toBeInTheDocument()
})

test('disables save button if form is not valid', async () => {
  const mockForm = {
    getValues: jest.fn(() => mockFormValues),
    formState: {
      isValid: false,
      isDirty: true,
    },
  }

  useForm
    .mockImplementationOnce(() => mockForm)
    .mockImplementationOnce(() => mockForm)

  render(
    <GenAiClassifierDrawer
      documentTypeId={mockDocTypeId}
      isLoading={false}
      onSubmit={jest.fn()}
      renderTrigger={mockTrigger}
    />,
  )

  const trigger = screen.getByTestId('drawer-trigger')
  await userEvent.click(trigger)

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE),
  })

  expect(saveButton).toBeDisabled()
})

test('disables save button if form values were not changed', async () => {
  const mockForm = {
    getValues: jest.fn(() => mockFormValues),
    formState: {
      isValid: true,
      isDirty: false,
    },
  }

  useForm
    .mockImplementationOnce(() => mockForm)
    .mockImplementationOnce(() => mockForm)

  render(
    <GenAiClassifierDrawer
      documentTypeId={mockDocTypeId}
      isLoading={false}
      onSubmit={jest.fn()}
      renderTrigger={mockTrigger}
    />,
  )

  const trigger = screen.getByTestId('drawer-trigger')
  await userEvent.click(trigger)

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE),
  })

  expect(saveButton).toBeDisabled()
})

test('calls onSubmit prop with correct args if document type does not have classifier', async () => {
  const mockOnSubmit = jest.fn()

  render(
    <GenAiClassifierDrawer
      documentTypeId={mockDocTypeId}
      isLoading={false}
      onSubmit={mockOnSubmit}
      renderTrigger={mockTrigger}
    />,
  )

  const trigger = screen.getByTestId('drawer-trigger')
  await userEvent.click(trigger)

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE),
  })
  await userEvent.click(saveButton)

  await waitFor(() => {
    expect(mockOnSubmit).nthCalledWith(
      1,
      {
        documentTypeId: mockDocTypeId,
        groupId: mockGroupId,
        ...mockFormValues,
      },
    )
  })
})

test('calls onSubmit prop with correct args if document type has classifier', async () => {
  jest.clearAllMocks()

  const mockOnSubmit = jest.fn()

  render(
    <GenAiClassifierDrawer
      classifier={mockClassifier}
      documentTypeId={mockClassifier.documentTypeId}
      isLoading={false}
      onSubmit={mockOnSubmit}
      renderTrigger={mockTrigger}
    />,
  )

  const trigger = screen.getByTestId('drawer-trigger')
  await userEvent.click(trigger)

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE),
  })
  await userEvent.click(saveButton)

  await waitFor(() => {
    expect(mockOnSubmit).nthCalledWith(
      1,
      {
        documentTypeId: mockDocTypeId,
        groupId: mockGroupId,
        genAiClassifierId: mockClassifier.genAiClassifierId,
        ...mockFormValues,
      },
    )
  })
})

test('sets form with classifier data if document type has classifier', async () => {
  jest.clearAllMocks()

  render(
    <GenAiClassifierDrawer
      classifier={mockClassifier}
      documentTypeId={mockClassifier.documentTypeId}
      isLoading={false}
      onSubmit={jest.fn()}
      renderTrigger={mockTrigger}
    />,
  )

  const trigger = screen.getByTestId('drawer-trigger')
  await userEvent.click(trigger)

  expect(mockSetValue).toHaveBeenCalledTimes(3)
  expect(mockSetValue).toHaveBeenCalledWith('name', mockClassifier.name)
  expect(mockSetValue).toHaveBeenCalledWith('llmType', mockClassifier.llmType)
  expect(mockSetValue).toHaveBeenCalledWith('prompt', mockClassifier.prompt)
})

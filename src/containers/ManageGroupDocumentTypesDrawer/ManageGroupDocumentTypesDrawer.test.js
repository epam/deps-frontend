
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { Localization, localize } from '@/localization/i18n'
import { DocumentTypesGroup } from '@/models/DocumentTypesGroup'
import { render } from '@/utils/rendererRTL'
import { ManageGroupDocumentTypesDrawer } from './ManageGroupDocumentTypesDrawer'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentTypesListPage')
jest.mock('@/selectors/requests')

jest.mock('@/containers/GenAiClassifierForm', () => mockComponent('GenAiClassifierForm'))

jest.mock('react-hook-form', () => ({
  ...mockReactHookForm,
  useForm: jest.fn(() => ({
    getValues: jest.fn(() => mockAddDocumentTypesFormData),
    reset: mockReset,
    formState: {
      isValid: true,
    },
  })),
}))

const mockReset = jest.fn()

const mockAddDocumentTypesFormData = {
  documentTypeIds: ['docTypeId1', 'docTypeId2'],
}

const mockDocumentTypesGroup = new DocumentTypesGroup({
  id: 'id',
  name: 'DocumentTypesGroup',
  documentTypeIds: ['id1', 'id2', 'id3'],
  createdAt: '12-12-2012',
  genAiClassifiers: [],
})

test('renders drawer correctly', () => {
  const props = {
    isLoading: false,
    addDocTypesToGroup: jest.fn(),
    addClassifierToDocType: jest.fn(),
    closeDrawer: jest.fn(),
    group: mockDocumentTypesGroup,
    visible: true,
  }

  render(<ManageGroupDocumentTypesDrawer {...props} />)

  const title = screen.getByText(localize(Localization.ADD_DOCUMENT_TYPES))
  const cancelButton = screen.getByRole('button', { name: localize(Localization.CANCEL) })
  const saveButton = screen.getByRole('button', { name: localize(Localization.SAVE) })
  const saveAndSetClassifiersButton = screen.getByRole('button', {
    name: localize(Localization.SAVE_AND_SET_CLASSIFIERS),
  })

  expect(title).toBeInTheDocument()
  expect(cancelButton).toBeInTheDocument()
  expect(saveButton).toBeInTheDocument()
  expect(saveAndSetClassifiersButton).toBeInTheDocument()
})

test('renders disabled save buttons if form is invalid', async () => {
  useForm.mockImplementationOnce(() => ({
    getValues: jest.fn(() => {}),
    reset: jest.fn(),
    formState: {
      isValid: false,
    },
  }))

  const props = {
    isLoading: false,
    addDocTypesToGroup: jest.fn(),
    addClassifierToDocType: jest.fn(),
    closeDrawer: jest.fn(),
    group: mockDocumentTypesGroup,
    visible: true,
  }

  render(<ManageGroupDocumentTypesDrawer {...props} />)

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE),
  })

  const saveAndSetClassifiersButton = screen.getByRole('button', {
    name: localize(Localization.SAVE_AND_SET_CLASSIFIERS),
  })

  expect(saveButton).toBeDisabled()
  expect(saveAndSetClassifiersButton).toBeDisabled()
})

test('calls closeDrawer when click on cancel button', async () => {
  const props = {
    isLoading: false,
    addDocTypesToGroup: jest.fn(),
    addClassifierToDocType: jest.fn(),
    closeDrawer: jest.fn(),
    group: mockDocumentTypesGroup,
    visible: true,
  }

  render(<ManageGroupDocumentTypesDrawer {...props} />)

  await userEvent.click(screen.getByRole('button', {
    name: localize(Localization.CANCEL),
  }))

  expect(props.closeDrawer).toHaveBeenCalled()
})

test('calls addDocTypesToGroup when click on save button', async () => {
  const props = {
    isLoading: false,
    addDocTypesToGroup: jest.fn(),
    addClassifierToDocType: jest.fn(),
    closeDrawer: jest.fn(),
    group: mockDocumentTypesGroup,
    visible: true,
  }

  render(<ManageGroupDocumentTypesDrawer {...props} />)

  await userEvent.click(screen.getByRole('button', {
    name: localize(Localization.SAVE),
  }))

  await waitFor(() => {
    expect(props.addDocTypesToGroup).toHaveBeenNthCalledWith(1, mockAddDocumentTypesFormData)
  })
})

test('calls addDocTypesToGroup when click on save & set classifiers button', async () => {
  const props = {
    isLoading: false,
    addDocTypesToGroup: jest.fn(),
    addClassifierToDocType: jest.fn(),
    closeDrawer: jest.fn(),
    group: mockDocumentTypesGroup,
    visible: true,
  }

  render(<ManageGroupDocumentTypesDrawer {...props} />)

  await userEvent.click(screen.getByRole('button', {
    name: localize(Localization.SAVE_AND_SET_CLASSIFIERS),
  }))

  await waitFor(() => {
    expect(props.addDocTypesToGroup).toHaveBeenNthCalledWith(1, mockAddDocumentTypesFormData)
  })
})

test('shows correct drawer content after user clicks on save & set classifiers button', async () => {
  const props = {
    isLoading: false,
    addDocTypesToGroup: jest.fn(),
    addClassifierToDocType: jest.fn(),
    closeDrawer: jest.fn(),
    group: mockDocumentTypesGroup,
    visible: true,
  }

  render(<ManageGroupDocumentTypesDrawer {...props} />)

  await userEvent.click(screen.getByRole('button', {
    name: localize(Localization.SAVE_AND_SET_CLASSIFIERS),
  }))

  const title = screen.getByText(localize(Localization.ADD_CLASSIFIER))
  const addClassifierForm = screen.getByText('GenAiClassifierForm')

  const cancelButton = screen.getByRole('button', {
    name: localize(Localization.CANCEL),
  })

  const saveAndSetClassifiersButton = screen.queryByRole('button', {
    name: localize(Localization.SAVE_AND_SET_CLASSIFIERS),
  })

  expect(title).toBeInTheDocument()
  expect(saveAndSetClassifiersButton).not.toBeInTheDocument()
  expect(cancelButton).toBeInTheDocument()
  expect(addClassifierForm).toBeInTheDocument()
})

test('calls addClassifierToDocType when user submits adding classifier for doc type', async () => {
  const props = {
    isLoading: false,
    addDocTypesToGroup: jest.fn(),
    addClassifierToDocType: jest.fn(),
    closeDrawer: jest.fn(),
    group: mockDocumentTypesGroup,
    visible: true,
  }

  render(<ManageGroupDocumentTypesDrawer {...props} />)

  const saveAndSetClassifiersButton = screen.getByRole('button', {
    name: localize(Localization.SAVE_AND_SET_CLASSIFIERS),
  })

  await userEvent.click(saveAndSetClassifiersButton)

  const saveButton = screen.queryByRole('button', {
    name: localize(Localization.SAVE),
  })

  await userEvent.click(saveButton)

  expect(props.addClassifierToDocType).toHaveBeenCalled()
})

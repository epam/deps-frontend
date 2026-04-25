
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { DocumentTypesGroupDrawer } from './DocumentTypesGroupDrawer'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentTypesListPage')
jest.mock('@/selectors/requests')

jest.mock('react-hook-form', () => ({
  ...mockReactHookForm,
  useForm: jest.fn(() => ({
    getValues: jest.fn(() => mockGroupFormValues),
    formState: {
      isValid: true,
    },
  })),
}))

const mockGroupFormValues = {
  name: 'Name',
  documentTypes: ['id1', 'id2', 'id3'],
}

test('render Drawer correctly', () => {
  const props = {
    isLoading: false,
    onSave: jest.fn(),
    closeDrawer: jest.fn(),
    visible: true,
  }

  render(<DocumentTypesGroupDrawer {...props} />)

  const title = screen.getByText(localize(Localization.ADD_GROUP))
  const cancelButton = screen.getByRole('button', { name: localize(Localization.CANCEL) })
  const saveButton = screen.getByRole('button', { name: localize(Localization.SAVE) })

  expect(title).toBeInTheDocument()
  expect(cancelButton).toBeInTheDocument()
  expect(saveButton).toBeInTheDocument()
})

test('calls closeDrawer when click on cancel button', async () => {
  const props = {
    isLoading: false,
    onSave: jest.fn(),
    closeDrawer: jest.fn(),
    visible: true,
  }

  render(<DocumentTypesGroupDrawer {...props} />)

  await userEvent.click(screen.getByRole('button', { name: localize(Localization.CANCEL) }))

  expect(props.closeDrawer).toHaveBeenCalled()
})

test('calls onSave when click on save button', async () => {
  const props = {
    isLoading: false,
    onSave: jest.fn(),
    closeDrawer: jest.fn(),
    visible: true,
  }

  render(<DocumentTypesGroupDrawer {...props} />)

  await userEvent.click(screen.getByRole('button', { name: localize(Localization.SAVE) }))

  await waitFor(() => {
    expect(props.onSave).toHaveBeenNthCalledWith(1, mockGroupFormValues)
  })
})

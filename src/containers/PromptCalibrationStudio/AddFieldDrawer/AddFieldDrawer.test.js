
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { mockUuid } from '@/mocks/mockUuid'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormValidationMode } from '@/components/Form'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { AddFieldDrawer } from './AddFieldDrawer'
import { DefaultFormValues } from './constants'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-hook-form', () => mockReactHookForm)
jest.mock('uuid', () => mockUuid)
jest.mock('@/components/Button', () => ({
  Button: Object.assign(
    ({ children, onClick, disabled }) => (
      <button
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    ),
    {
      Secondary: ({ children, onClick }) => (
        <button
          data-testid="secondary-button"
          onClick={onClick}
        >
          {children}
        </button>
      ),
    },
  ),
  ButtonType: {
    PRIMARY: 'PRIMARY',
  },
}))
jest.mock('@/components/Icons/PlusIcon', () => mockShallowComponent('PlusIcon'))
jest.mock('./AddFieldForm', () => mockShallowComponent('AddFieldForm'))
jest.mock('./AddFieldDrawer.styles', () => ({
  StyledDrawer: ({ children, open, onClose, footer, title }) => (
    open ? (
      <div data-testid="styled-drawer">
        <div data-testid="drawer-title">{title}</div>
        <button
          data-testid="drawer-close"
          onClick={onClose}
        >
          Close
        </button>
        {children}
        <div data-testid="drawer-footer">{footer}</div>
      </div>
    ) : null
  ),
  DrawerFooterWrapper: ({ children }) => <div data-testid="drawer-footer-wrapper">{children}</div>,
}))

let defaultProps
let mockUseForm
let mockFormApi

beforeEach(() => {
  jest.clearAllMocks()

  mockFormApi = {
    formState: {
      isValid: false,
    },
    getValues: jest.fn(() => DefaultFormValues),
    setValue: jest.fn(),
    reset: jest.fn(),
  }

  mockUseForm = jest.fn(() => mockFormApi)

  mockReactHookForm.useForm.mockImplementation(mockUseForm)

  defaultProps = {
    add: jest.fn(),
    defaultExtractorId: 'test-extractor-id',
  }
})

test('renders secondary button with icon and drawer is not visible initially', () => {
  render(<AddFieldDrawer {...defaultProps} />)

  const button = screen.getByTestId('secondary-button')
  expect(button).toBeInTheDocument()
  expect(button).toHaveTextContent(localize(Localization.ADD_FIELD))
  expect(screen.getByTestId('PlusIcon')).toBeInTheDocument()
  expect(screen.queryByTestId('styled-drawer')).not.toBeInTheDocument()
})

test('opens drawer with correct content when secondary button is clicked', async () => {
  const user = userEvent.setup()
  render(<AddFieldDrawer {...defaultProps} />)

  await user.click(screen.getByTestId('secondary-button'))

  expect(screen.getByTestId('styled-drawer')).toBeInTheDocument()
  expect(screen.getByTestId('drawer-title')).toHaveTextContent(localize(Localization.ADD_FIELD))
  expect(screen.getByTestId('AddFieldForm')).toBeInTheDocument()
})

test('renders footer with cancel and submit buttons', async () => {
  const user = userEvent.setup()
  render(<AddFieldDrawer {...defaultProps} />)

  await user.click(screen.getByTestId('secondary-button'))

  expect(screen.getByTestId('drawer-footer-wrapper')).toBeInTheDocument()
  const buttons = screen.getAllByRole('button')
  const cancelButton = buttons.find((btn) => btn.textContent === localize(Localization.CANCEL))
  const submitButton = buttons.find((btn) => btn.textContent === localize(Localization.SUBMIT))
  expect(cancelButton).toBeInTheDocument()
  expect(submitButton).toBeInTheDocument()
})

test('submit button state depends on form validity', async () => {
  const user = userEvent.setup()

  mockFormApi.formState.isValid = false
  const { rerender } = render(<AddFieldDrawer {...defaultProps} />)
  await user.click(screen.getByTestId('secondary-button'))

  let buttons = screen.getAllByRole('button')
  let submitButton = buttons.find((btn) => btn.textContent === localize(Localization.SUBMIT))
  expect(submitButton).toBeDisabled()

  mockFormApi.formState.isValid = true
  rerender(<AddFieldDrawer {...defaultProps} />)

  buttons = screen.getAllByRole('button')
  submitButton = buttons.find((btn) => btn.textContent === localize(Localization.SUBMIT))
  expect(submitButton).not.toBeDisabled()
})

test('closes drawer when cancel button or close icon is clicked', async () => {
  const user = userEvent.setup()
  render(<AddFieldDrawer {...defaultProps} />)

  await user.click(screen.getByTestId('secondary-button'))
  expect(screen.getByTestId('styled-drawer')).toBeInTheDocument()

  const buttons = screen.getAllByRole('button')
  const cancelButton = buttons.find((btn) => btn.textContent === localize(Localization.CANCEL))
  await user.click(cancelButton)

  await waitFor(() => {
    expect(screen.queryByTestId('styled-drawer')).not.toBeInTheDocument()
  })

  await user.click(screen.getByTestId('secondary-button'))
  expect(screen.getByTestId('styled-drawer')).toBeInTheDocument()

  await user.click(screen.getByTestId('drawer-close'))

  await waitFor(() => {
    expect(screen.queryByTestId('styled-drawer')).not.toBeInTheDocument()
  })
})

test('submits form and creates Field instance with correct values', async () => {
  const user = userEvent.setup()
  mockFormApi.formState.isValid = true
  const formValues = {
    ...DefaultFormValues,
    name: 'Test Field',
    fieldType: 'string',
  }
  mockFormApi.getValues.mockReturnValue(formValues)

  render(<AddFieldDrawer {...defaultProps} />)

  await user.click(screen.getByTestId('secondary-button'))

  const buttons = screen.getAllByRole('button')
  const submitButton = buttons.find((btn) => btn.textContent === localize(Localization.SUBMIT))
  await user.click(submitButton)

  expect(mockFormApi.getValues).toHaveBeenCalled()
  expect(defaultProps.add).toHaveBeenCalledTimes(1)
  expect(defaultProps.add).toHaveBeenNthCalledWith(1, expect.objectContaining({
    name: 'Test Field',
    fieldType: 'string',
    multiplicity: 'single',
    aliases: false,
    readOnly: false,
    confidential: false,
    displayCharLimit: 10,
    extractorId: 'test-extractor-id',
    value: '',
    isNew: true,
  }))
})

test('initializes form with correct configuration', () => {
  render(<AddFieldDrawer {...defaultProps} />)

  expect(mockUseForm).toHaveBeenCalledWith({
    mode: FormValidationMode.ON_CHANGE,
    shouldUnregister: true,
    defaultValues: DefaultFormValues,
  })
})

test('closes drawer after successful form submission', async () => {
  const user = userEvent.setup()
  mockFormApi.formState.isValid = true
  const formValues = {
    ...DefaultFormValues,
    name: 'New Field',
    fieldType: 'text',
  }
  mockFormApi.getValues.mockReturnValue(formValues)

  render(<AddFieldDrawer {...defaultProps} />)

  await user.click(screen.getByTestId('secondary-button'))
  expect(screen.getByTestId('styled-drawer')).toBeInTheDocument()

  const buttons = screen.getAllByRole('button')
  const submitButton = buttons.find((btn) => btn.textContent === localize(Localization.SUBMIT))
  await user.click(submitButton)

  await waitFor(() => {
    expect(screen.queryByTestId('styled-drawer')).not.toBeInTheDocument()
  })
})

test('creates Field with extractorId from props', async () => {
  const user = userEvent.setup()
  mockFormApi.formState.isValid = true
  const customExtractorId = 'custom-extractor-123'
  const formValues = {
    ...DefaultFormValues,
    name: 'Test Field',
  }
  mockFormApi.getValues.mockReturnValue(formValues)

  render(
    <AddFieldDrawer
      {...defaultProps}
      defaultExtractorId={customExtractorId}
    />,
  )

  await user.click(screen.getByTestId('secondary-button'))

  const buttons = screen.getAllByRole('button')
  const submitButton = buttons.find((btn) => btn.textContent === localize(Localization.SUBMIT))
  await user.click(submitButton)

  expect(defaultProps.add).toHaveBeenCalledTimes(1)
  expect(defaultProps.add).toHaveBeenNthCalledWith(1, expect.objectContaining({
    name: 'Test Field',
    fieldType: 'string',
    multiplicity: 'single',
    aliases: false,
    readOnly: false,
    confidential: false,
    displayCharLimit: 10,
    extractorId: customExtractorId,
    value: '',
    isNew: true,
  }))
})

test('does not call add function when cancel button is clicked', async () => {
  const user = userEvent.setup()
  mockFormApi.formState.isValid = true
  render(<AddFieldDrawer {...defaultProps} />)

  await user.click(screen.getByTestId('secondary-button'))

  const cancelButton = screen.getByRole('button', { name: localize(Localization.CANCEL) })
  await user.click(cancelButton)

  expect(defaultProps.add).not.toHaveBeenCalled()
})

test('submitData merges form values with defaultExtractorId correctly', async () => {
  const user = userEvent.setup()
  mockFormApi.formState.isValid = true
  const formValues = {
    name: 'Test Field',
    fieldType: 'string',
    multiplicity: 'single',
    aliases: false,
    readOnly: true,
    confidential: true,
    displayCharLimit: 20,
  }
  mockFormApi.getValues.mockReturnValue(formValues)

  render(<AddFieldDrawer {...defaultProps} />)

  await user.click(screen.getByTestId('secondary-button'))

  const buttons = screen.getAllByRole('button')
  const submitButton = buttons.find((btn) => btn.textContent === localize(Localization.SUBMIT))
  await user.click(submitButton)

  expect(defaultProps.add).toHaveBeenCalledTimes(1)
  expect(defaultProps.add).toHaveBeenNthCalledWith(1, expect.objectContaining({
    name: 'Test Field',
    fieldType: 'string',
    multiplicity: 'single',
    aliases: false,
    readOnly: true,
    confidential: true,
    displayCharLimit: 20,
    extractorId: 'test-extractor-id',
    value: '',
    isNew: true,
  }))
})


import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReviewPolicy } from '@/enums/ReviewPolicy'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { WorkflowConfigurationDrawer } from './WorkflowConfigurationDrawer'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-hook-form', () => ({
  ...mockReactHookForm,
  useForm: jest.fn(() => ({
    handleSubmit: jest.fn((fn) => fn),
    getValues: jest.fn(() => mockFormValues),
    formState: {},
  })),
}))

jest.mock('../WorkflowConfigurationForm', () => mockShallowComponent('WorkflowConfigurationForm'))

const mockFormValues = {
  reviewPolicy: ReviewPolicy.ALWAYS_REVIEW,
  needsExtraction: true,
  needsValidation: false,
}

const defaultProps = {
  visible: true,
  onClose: jest.fn(),
  onSubmit: jest.fn(),
  isLoading: false,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders drawer with workflow configuration title when visible', () => {
  render(<WorkflowConfigurationDrawer {...defaultProps} />)

  expect(screen.getByText(localize(Localization.WORKFLOW_CONFIGURATION))).toBeInTheDocument()
})

test('renders WorkflowConfigurationForm inside drawer', () => {
  render(<WorkflowConfigurationDrawer {...defaultProps} />)

  expect(screen.getByTestId('WorkflowConfigurationForm')).toBeInTheDocument()
})

test('calls onClose when cancel button is clicked', async () => {
  render(<WorkflowConfigurationDrawer {...defaultProps} />)

  const cancelButton = screen.getByText(localize(Localization.CANCEL))
  await userEvent.click(cancelButton)

  expect(defaultProps.onClose).toHaveBeenCalled()
})

test('calls onSubmit with form values when save button is clicked', async () => {
  render(<WorkflowConfigurationDrawer {...defaultProps} />)

  const saveButton = screen.getByText(localize(Localization.SAVE))
  await userEvent.click(saveButton)

  expect(defaultProps.onSubmit).toHaveBeenCalledWith(mockFormValues)
})

test('cancel button is disabled when isLoading is true', () => {
  render(
    <WorkflowConfigurationDrawer
      {...defaultProps}
      isLoading
    />,
  )

  const cancelButton = screen.getByRole('button', { name: localize(Localization.CANCEL) })
  expect(cancelButton).toBeDisabled()
})

test('does not render drawer content when visible is false', () => {
  render(
    <WorkflowConfigurationDrawer
      {...defaultProps}
      visible={false}
    />,
  )

  expect(screen.queryByTestId('WorkflowConfigurationForm')).not.toBeInTheDocument()
})


import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '@/components/Modal'
import { CALIBRATION_MODE } from '@/containers/PromptCalibrationStudio/constants'
import { Field, Query, QueryNode } from '@/containers/PromptCalibrationStudio/viewModels'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { FieldFooter } from './FieldFooter'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('../../hooks', () => ({
  useFieldCalibration: jest.fn(() => ({
    activeField: mockActiveField,
    closeCalibrationMode: mockCloseCalibrationMode,
    setCalibrationMode: mockSetCalibrationMode,
    updateFieldsAndClose: mockUpdateFieldsAndClose,
  })),
}))

Modal.confirm = jest.fn()

const mockActiveField = new Field({
  id: 'field-1',
  name: 'Test Field 1',
  query: new Query({
    nodes: [new QueryNode({
      id: 'node-1',
      name: 'Node 1',
      prompt: 'Test prompt',
    })],
  }),
})

const mockCloseCalibrationMode = jest.fn()
const mockSetCalibrationMode = jest.fn()
const mockUpdateFieldsAndClose = jest.fn()

const defaultProps = {
  hasInsightsError: false,
  isExecutedValueChanged: false,
  isLoading: false,
  isPromptChanged: false,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders all buttons with correct labels', () => {
  render(<FieldFooter {...defaultProps} />)

  const closeButton = screen.getByRole('button', { name: localize(Localization.CLOSE) })
  const saveButton = screen.getByRole('button', { name: localize(Localization.SAVE) })
  const advancedModeButton = screen.getByRole('button', { name: localize(Localization.ADVANCED_MODE) })

  expect(closeButton).toBeInTheDocument()
  expect(saveButton).toBeInTheDocument()
  expect(advancedModeButton).toBeInTheDocument()
})

test('disables all buttons when isLoading is true', () => {
  const props = {
    ...defaultProps,
    isLoading: true,
  }

  render(<FieldFooter {...props} />)

  const closeButton = screen.getByRole('button', { name: localize(Localization.CLOSE) })
  const saveButton = screen.getByRole('button', { name: localize(Localization.SAVE) })
  const advancedModeButton = screen.getByRole('button', { name: localize(Localization.ADVANCED_MODE) })

  expect(closeButton).toBeDisabled()
  expect(saveButton).toBeDisabled()
  expect(advancedModeButton).toBeDisabled()
})

test('disables Save button when isExecutedValueChanged is false', () => {
  const props = {
    ...defaultProps,
    isExecutedValueChanged: false,
  }

  render(<FieldFooter {...props} />)

  const saveButton = screen.getByRole('button', { name: localize(Localization.SAVE) })

  expect(saveButton).toBeDisabled()
})

test('enables Save button when isExecutedValueChanged is true', () => {
  const props = {
    ...defaultProps,
    isExecutedValueChanged: true,
  }

  render(<FieldFooter {...props} />)

  const saveButton = screen.getByRole('button', { name: localize(Localization.SAVE) })

  expect(saveButton).not.toBeDisabled()
})

test('calls closeCalibrationMode when Close button is clicked and no changes', async () => {
  const props = {
    ...defaultProps,
    isExecutedValueChanged: false,
    isPromptChanged: false,
  }

  render(<FieldFooter {...props} />)

  const closeButton = screen.getByRole('button', { name: localize(Localization.CLOSE) })
  await userEvent.click(closeButton)

  expect(mockCloseCalibrationMode).toHaveBeenCalled()
  expect(Modal.confirm).not.toHaveBeenCalled()
})

test('shows Modal.confirm when Close button is clicked and isExecutedValueChanged is true', async () => {
  const props = {
    ...defaultProps,
    isExecutedValueChanged: true,
    isPromptChanged: false,
  }

  render(<FieldFooter {...props} />)

  const closeButton = screen.getByRole('button', { name: localize(Localization.CLOSE) })
  await userEvent.click(closeButton)

  expect(Modal.confirm).toHaveBeenCalledWith({
    title: localize(Localization.DISCARD_CHANGES_CONFORM_MESSAGE),
    onOk: expect.any(Function),
  })

  expect(mockCloseCalibrationMode).not.toHaveBeenCalled()
})

test('calls closeCalibrationMode after confirming modal when isExecutedValueChanged is true', async () => {
  const props = {
    ...defaultProps,
    isExecutedValueChanged: true,
    isPromptChanged: false,
  }

  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  render(<FieldFooter {...props} />)

  const closeButton = screen.getByRole('button', { name: localize(Localization.CLOSE) })
  await userEvent.click(closeButton)

  expect(Modal.confirm).toHaveBeenCalled()
  expect(mockCloseCalibrationMode).toHaveBeenCalled()
})

test('calls updateFieldsAndClose when Save button is clicked', async () => {
  const props = {
    ...defaultProps,
    isExecutedValueChanged: true,
  }

  render(<FieldFooter {...props} />)

  const saveButton = screen.getByRole('button', { name: localize(Localization.SAVE) })
  await userEvent.click(saveButton)

  expect(mockUpdateFieldsAndClose).toHaveBeenCalledTimes(1)
  expect(mockUpdateFieldsAndClose).toHaveBeenCalledWith(
    expect.objectContaining({ id: 'field-1' }),
  )
})

test('shows Modal.confirm when Close button is clicked and isPromptChanged is true', async () => {
  const props = {
    ...defaultProps,
    isExecutedValueChanged: false,
    isPromptChanged: true,
  }

  render(<FieldFooter {...props} />)

  const closeButton = screen.getByRole('button', { name: localize(Localization.CLOSE) })
  await userEvent.click(closeButton)

  expect(Modal.confirm).toHaveBeenCalledWith({
    title: localize(Localization.ADVANCED_MODE_DISABLED_TOOLTIP),
    onOk: expect.any(Function),
  })

  expect(mockCloseCalibrationMode).not.toHaveBeenCalled()
})

test('calls closeCalibrationMode after confirming modal when isPromptChanged is true', async () => {
  const props = {
    ...defaultProps,
    isExecutedValueChanged: false,
    isPromptChanged: true,
  }

  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  render(<FieldFooter {...props} />)

  const closeButton = screen.getByRole('button', { name: localize(Localization.CLOSE) })
  await userEvent.click(closeButton)

  expect(Modal.confirm).toHaveBeenCalled()
  expect(mockCloseCalibrationMode).toHaveBeenCalled()
})

test('shows Modal.confirm when Advanced Mode button is clicked and isPromptChanged is true', async () => {
  const props = {
    ...defaultProps,
    isPromptChanged: true,
  }

  render(<FieldFooter {...props} />)

  const advancedModeButton = screen.getByRole('button', { name: localize(Localization.ADVANCED_MODE) })
  await userEvent.click(advancedModeButton)

  expect(Modal.confirm).toHaveBeenCalledWith({
    title: localize(Localization.ADVANCED_MODE_DISABLED_TOOLTIP),
    onOk: expect.any(Function),
  })

  expect(mockCloseCalibrationMode).not.toHaveBeenCalled()
})

test('switches to advanced mode when Advanced Mode button is clicked and no changes', async () => {
  const props = {
    ...defaultProps,
    isPromptChanged: false,
  }

  render(<FieldFooter {...props} />)

  const advancedModeButton = screen.getByRole('button', { name: localize(Localization.ADVANCED_MODE) })
  await userEvent.click(advancedModeButton)

  expect(Modal.confirm).not.toHaveBeenCalled()
  expect(mockSetCalibrationMode).toHaveBeenCalledWith(CALIBRATION_MODE.ADVANCED)
})

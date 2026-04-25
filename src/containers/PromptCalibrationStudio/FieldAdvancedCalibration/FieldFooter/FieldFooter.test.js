
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '@/components/Modal'
import { CALIBRATION_MODE } from '@/containers/PromptCalibrationStudio/constants'
import { useFieldCalibration } from '@/containers/PromptCalibrationStudio/hooks'
import { Field, Query, QueryNode } from '@/containers/PromptCalibrationStudio/viewModels'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { FieldFooter } from './FieldFooter'

jest.mock('@/utils/env', () => mockEnv)

Modal.confirm = jest.fn()

jest.mock('../../hooks', () => ({
  useFieldCalibration: jest.fn(() => mockCalibrationState),
}))

const mockSetActiveField = jest.fn()
const mockCloseCalibrationMode = jest.fn()
const mockSetCalibrationMode = jest.fn()
const mockUpdateFieldsAndClose = jest.fn()

const mockActiveField = new Field({
  id: 'field-1',
  query: new Query({
    nodes: [
      new QueryNode({
        id: 'node-1',
        name: 'Node 1',
        prompt: 'Test prompt',
      }),
    ],
    value: 'value 1',
  }),
  value: 'value 1',
})

const mockCalibrationState = {
  activeField: mockActiveField,
  closeCalibrationMode: mockCloseCalibrationMode,
  setCalibrationMode: mockSetCalibrationMode,
  updateFieldsAndClose: mockUpdateFieldsAndClose,
}

const mockOnExecuteHandler = jest.fn()

const defaultProps = {
  isDisabled: false,
  hasInsightsError: false,
  onExecute: mockOnExecuteHandler,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders all buttons with correct labels', () => {
  render(<FieldFooter {...defaultProps} />)

  const closeButton = screen.getByRole('button', { name: localize(Localization.CLOSE) })
  const executeChainButton = screen.getByRole('button', { name: localize(Localization.EXECUTE_CHAIN) })
  const basicModeButton = screen.getByRole('button', { name: localize(Localization.BASIC_MODE) })

  expect(closeButton).toBeInTheDocument()
  expect(executeChainButton).toBeInTheDocument()
  expect(basicModeButton).toBeInTheDocument()
})

test('shows Execute Chain when no changes to save', () => {
  render(<FieldFooter {...defaultProps} />)

  const executeChainButton = screen.getByRole('button', { name: localize(Localization.EXECUTE_CHAIN) })

  expect(executeChainButton).toBeDisabled()
})

test('enables Save button when there are changes to save', () => {
  useFieldCalibration.mockReturnValueOnce({
    ...mockCalibrationState,
    activeField: {
      ...mockActiveField,
      query: {
        ...mockActiveField.query,
        value: 'value 2',
      },
    },
  })

  render(<FieldFooter {...defaultProps} />)

  const saveButton = screen.getByRole('button', { name: localize(Localization.SAVE) })

  expect(saveButton).not.toBeDisabled()
})

test('enables Save button when executedValue is false', () => {
  useFieldCalibration.mockReturnValueOnce({
    ...mockCalibrationState,
    activeField: {
      ...mockActiveField,
      value: true,
      query: {
        ...mockActiveField.query,
        value: false,
      },
    },
  })

  render(<FieldFooter {...defaultProps} />)

  const saveButton = screen.getByRole('button', { name: localize(Localization.SAVE) })

  expect(saveButton).not.toBeDisabled()
})

test('shows Execute Chain when executedValue is null', () => {
  useFieldCalibration.mockReturnValueOnce({
    ...mockCalibrationState,
    activeField: {
      ...mockActiveField,
      value: 'some value',
      query: {
        ...mockActiveField.query,
        value: null,
      },
    },
  })

  render(<FieldFooter {...defaultProps} />)

  const executeChainButton = screen.getByRole('button', { name: localize(Localization.EXECUTE_CHAIN) })
  const saveButton = screen.queryByRole('button', { name: localize(Localization.SAVE) })

  expect(executeChainButton).toBeInTheDocument()
  expect(saveButton).not.toBeInTheDocument()
})

test('shows Execute Chain when executedValue is undefined', () => {
  useFieldCalibration.mockReturnValueOnce({
    ...mockCalibrationState,
    activeField: {
      ...mockActiveField,
      value: 'some value',
      query: {
        ...mockActiveField.query,
        value: undefined,
      },
    },
  })

  render(<FieldFooter {...defaultProps} />)

  const executeChainButton = screen.getByRole('button', { name: localize(Localization.EXECUTE_CHAIN) })
  const saveButton = screen.queryByRole('button', { name: localize(Localization.SAVE) })

  expect(executeChainButton).toBeInTheDocument()
  expect(saveButton).not.toBeInTheDocument()
})

test('calls closeCalibrationMode when Close button is clicked and shouldShowConfirmation is false', async () => {
  render(<FieldFooter {...defaultProps} />)

  const closeButton = screen.getByRole('button', { name: localize(Localization.CLOSE) })
  await userEvent.click(closeButton)

  expect(mockCloseCalibrationMode).toHaveBeenCalled()
})

test('shows Modal.confirm when Close button is clicked and shouldShowConfirmation is true', async () => {
  useFieldCalibration.mockReturnValueOnce({
    ...mockCalibrationState,
    activeField: {
      ...mockActiveField,
      query: {
        ...mockActiveField.query,
        value: 'value 2',
      },
    },
  })

  render(<FieldFooter {...defaultProps} />)

  const closeButton = screen.getByRole('button', { name: localize(Localization.CLOSE) })
  await userEvent.click(closeButton)

  expect(Modal.confirm).toHaveBeenCalledWith({
    title: localize(Localization.DISCARD_CHANGES_CONFORM_MESSAGE),
    onOk: expect.any(Function),
  })

  expect(mockSetCalibrationMode).not.toHaveBeenCalled()
  expect(mockSetActiveField).not.toHaveBeenCalled()
})

test('calls closeCalibrationMode after confirming modal when shouldShowConfirmation is true', async () => {
  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  useFieldCalibration.mockReturnValueOnce({
    ...mockCalibrationState,
    activeField: {
      ...mockActiveField,
      query: {
        ...mockActiveField.query,
        value: 'value 2',
      },
    },
  })

  render(<FieldFooter {...defaultProps} />)

  const closeButton = screen.getByRole('button', { name: localize(Localization.CLOSE) })
  await userEvent.click(closeButton)

  expect(Modal.confirm).toHaveBeenCalled()
  expect(mockCloseCalibrationMode).toHaveBeenCalled()
})

test('calls updateFieldsAndClose when Save button is clicked', async () => {
  useFieldCalibration.mockReturnValueOnce({
    ...mockCalibrationState,
    activeField: {
      ...mockActiveField,
      query: {
        ...mockActiveField.query,
        value: 'value 2',
      },
    },
  })

  render(<FieldFooter {...defaultProps} />)

  const saveButton = screen.getByRole('button', { name: localize(Localization.SAVE) })
  await userEvent.click(saveButton)

  expect(mockUpdateFieldsAndClose).toHaveBeenCalledTimes(1)
  expect(mockUpdateFieldsAndClose).toHaveBeenCalledWith(
    expect.objectContaining({ id: 'field-1' }),
  )
})

test('switches to basic mode when Basic Mode button is clicked', async () => {
  render(<FieldFooter {...defaultProps} />)

  const basicModeButton = screen.getByRole('button', { name: localize(Localization.BASIC_MODE) })
  await userEvent.click(basicModeButton)

  expect(mockSetCalibrationMode).toHaveBeenCalledWith(CALIBRATION_MODE.BASE)
})

test('disables Basic Mode button when activeField has more than one node', () => {
  useFieldCalibration.mockReturnValueOnce({
    ...mockCalibrationState,
    activeField: {
      id: 'field-1',
      query: new Query({
        nodes: [
          new QueryNode({
            id: 'node-1',
            name: 'Node 1',
            prompt: 'Prompt 1',
          }),
          new QueryNode({
            id: 'node-2',
            name: 'Node 2',
            prompt: 'Prompt 2',
          }),
        ],
      }),
    },
  })

  render(<FieldFooter {...defaultProps} />)

  const basicModeButton = screen.getByRole('button', { name: localize(Localization.BASIC_MODE) })

  expect(basicModeButton).toBeDisabled()
})

test('disables all buttons when isDisabled is true', () => {
  const props = {
    ...defaultProps,
    isDisabled: true,
  }

  render(<FieldFooter {...props} />)

  const closeButton = screen.getByRole('button', { name: localize(Localization.CLOSE) })
  const executeChainButton = screen.getByRole('button', { name: /execute chain/i })
  const basicModeButton = screen.getByRole('button', { name: localize(Localization.BASIC_MODE) })

  expect(closeButton).toBeDisabled()
  expect(executeChainButton).toBeDisabled()
  expect(basicModeButton).toBeDisabled()
})

test('disables Execute Chain button when isDisabled is true', () => {
  useFieldCalibration.mockReturnValueOnce({
    ...mockCalibrationState,
    activeField: new Field({
      id: 'field-1',
      query: new Query({
        nodes: [
          new QueryNode({
            id: 'node-1',
            name: 'Node 1',
            prompt: 'updated prompt',
          }),
        ],
        value: null,
        executedNodes: [
          new QueryNode({
            id: 'node-1',
            name: 'Node 1',
            prompt: 'original prompt',
          }),
        ],
      }),
      value: 'value 1',
    }),
  })

  const props = {
    ...defaultProps,
    isDisabled: true,
  }

  render(<FieldFooter {...props} />)

  const executeChainButton = screen.getByRole('button', { name: /execute chain/i })

  expect(executeChainButton).toBeDisabled()
})

test('enables Execute Chain button when nodes differ from executedNodes', () => {
  useFieldCalibration.mockReturnValueOnce({
    ...mockCalibrationState,
    activeField: new Field({
      id: 'field-1',
      query: new Query({
        nodes: [
          new QueryNode({
            id: 'node-1',
            name: 'Node 1',
            prompt: 'updated prompt',
          }),
        ],
        value: null,
        executedNodes: [
          new QueryNode({
            id: 'node-1',
            name: 'Node 1',
            prompt: 'original prompt',
          }),
        ],
      }),
      value: 'value 1',
    }),
  })

  render(<FieldFooter {...defaultProps} />)

  const executeChainButton = screen.getByRole('button', { name: localize(Localization.EXECUTE_CHAIN) })

  expect(executeChainButton).not.toBeDisabled()
})

test('calls onExecute with current query nodes when Execute Chain button is clicked', async () => {
  useFieldCalibration.mockReturnValueOnce({
    ...mockCalibrationState,
    activeField: new Field({
      id: 'field-1',
      query: new Query({
        nodes: [
          new QueryNode({
            id: 'node-1',
            name: 'Node 1',
            prompt: 'updated prompt',
          }),
        ],
        value: null,
        executedNodes: [
          new QueryNode({
            id: 'node-1',
            name: 'Node 1',
            prompt: 'original prompt',
          }),
        ],
      }),
      value: 'value 1',
    }),
  })

  render(<FieldFooter {...defaultProps} />)

  const executeChainButton = screen.getByRole('button', { name: localize(Localization.EXECUTE_CHAIN) })
  await userEvent.click(executeChainButton)

  expect(mockOnExecuteHandler).toHaveBeenCalledTimes(1)
  expect(mockOnExecuteHandler).toHaveBeenNthCalledWith(1, expect.objectContaining({ nodes: expect.any(Array) }))
})

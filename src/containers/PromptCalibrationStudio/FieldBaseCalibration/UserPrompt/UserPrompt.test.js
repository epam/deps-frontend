
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useFieldCalibration } from '@/containers/PromptCalibrationStudio/hooks'
import { Query, QueryNode } from '@/containers/PromptCalibrationStudio/viewModels'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { UserPrompt } from './UserPrompt'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('lodash/debounce', () =>
  jest.fn((fn) => {
    fn.cancel = jest.fn()
    return fn
  }),
)

const mockSetActiveField = jest.fn()

const mockActiveField = {
  id: 'field-1',
  query: Query.createQueryWithOneNode('initial prompt', 'initial prompt'),
  isDirty: false,
}

jest.mock('../../hooks', () => ({
  useFieldCalibration: jest.fn(() => ({
    activeField: mockActiveField,
    setActiveField: mockSetActiveField,
  })),
}))

const defaultProps = {
  isLoading: false,
  onExecute: jest.fn(),
  prompt: '',
  setPrompt: jest.fn(),
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders UserPrompt correctly', () => {
  const props = {
    ...defaultProps,
    prompt: 'test prompt',
  }

  render(<UserPrompt {...props} />)

  const label = screen.getByText(localize(Localization.PROMPT))
  const executeButton = screen.getByRole('button', { name: new RegExp(localize(Localization.EXECUTE)) })
  const textarea = screen.getByRole('textbox')

  expect(label).toBeInTheDocument()
  expect(executeButton).toBeInTheDocument()
  expect(textarea).toBeInTheDocument()
  expect(textarea).toHaveValue('test prompt')
})

test('Execute button is disabled when prompt is empty', () => {
  const props = {
    ...defaultProps,
    prompt: '',
  }

  render(<UserPrompt {...props} />)

  const executeButton = screen.getByRole('button', { name: new RegExp(localize(Localization.EXECUTE)) })

  expect(executeButton).toBeDisabled()
})

test('disables Execute button when prompt matches activeField query value', async () => {
  const mockQuery = new Query({
    nodes: [new QueryNode({
      name: 'initial prompt',
      prompt: 'initial prompt',
    })],
  })

  useFieldCalibration.mockReturnValueOnce({
    activeField: {
      ...mockActiveField,
      query: mockQuery,
    },
    setActiveField: mockSetActiveField,
  })

  render(<UserPrompt {...defaultProps} />)

  const textarea = screen.getByRole('textbox')

  await userEvent.type(textarea, mockQuery.nodes[0].prompt)

  await waitFor(() => {
    const executeButton = screen.getByRole('button', { name: new RegExp(localize(Localization.EXECUTE)) })
    expect(executeButton).toBeDisabled()
  })
})

test('calls setPrompt when user types in textarea', async () => {
  render(<UserPrompt {...defaultProps} />)

  const textarea = screen.getByRole('textbox')
  const testValue = 'Execute this prompt'

  await userEvent.type(textarea, testValue)

  await waitFor(() => {
    expect(defaultProps.setPrompt).toHaveBeenCalledWith(testValue)
  })
})

test('calls onExecute when Execute button is clicked', async () => {
  const props = {
    ...defaultProps,
    prompt: 'new prompt',
  }

  render(<UserPrompt {...props} />)

  const executeButton = screen.getByRole('button', { name: new RegExp(localize(Localization.EXECUTE)) })
  await userEvent.click(executeButton)

  expect(props.onExecute).toHaveBeenCalledTimes(1)
})

test('disables Execute button when prompt matches activeField query value', () => {
  const props = {
    ...defaultProps,
    prompt: 'initial prompt',
  }

  render(<UserPrompt {...props} />)

  const executeButton = screen.getByRole('button', { name: new RegExp(localize(Localization.EXECUTE)) })

  expect(executeButton).toBeDisabled()
})

test('enables Execute button when prompt differs from activeField query value', () => {
  const props = {
    ...defaultProps,
    prompt: 'different prompt',
  }

  render(<UserPrompt {...props} />)

  const executeButton = screen.getByRole('button', { name: new RegExp(localize(Localization.EXECUTE)) })

  expect(executeButton).not.toBeDisabled()
})

test('disables Execute button when isLoading is true', () => {
  const props = {
    ...defaultProps,
    isLoading: true,
    prompt: 'new prompt',
  }

  render(<UserPrompt {...props} />)

  const executeButton = screen.getByRole('button', { name: new RegExp(localize(Localization.EXECUTE)) })

  expect(executeButton).toBeDisabled()
})

test('shows tooltip when Execute button is disabled', async () => {
  render(<UserPrompt {...defaultProps} />)

  const executeButton = screen.getByRole('button', { name: localize(Localization.EXECUTE) })
  await userEvent.hover(executeButton)

  await waitFor(() => {
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent(localize(Localization.EDIT_PROMPT_BEFORE_EXECUTE))
  })
})

test('shows shortcut hint tooltip when Execute button is enabled', async () => {
  const props = {
    ...defaultProps,
    prompt: 'different prompt',
  }

  render(<UserPrompt {...props} />)

  const executeButton = screen.getByRole('button', { name: localize(Localization.EXECUTE) })
  await userEvent.hover(executeButton)

  await waitFor(() => {
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent(localize(Localization.SHIFT_ENTER_SHORTCUT_HINT))
  })
})

test('calls onExecute when Shift+Enter is pressed in textarea', async () => {
  const props = {
    ...defaultProps,
    prompt: 'new prompt',
  }

  render(<UserPrompt {...props} />)

  const textarea = screen.getByRole('textbox')
  await userEvent.click(textarea)
  await userEvent.keyboard('{Shift>}{Enter}{/Shift}')

  expect(props.onExecute).toHaveBeenCalledTimes(1)
})

test('does not call onExecute when Shift+Enter is pressed and button is disabled', async () => {
  const props = {
    ...defaultProps,
    prompt: 'initial prompt',
  }

  render(<UserPrompt {...props} />)

  const textarea = screen.getByRole('textbox')
  await userEvent.click(textarea)
  await userEvent.keyboard('{Shift>}{Enter}{/Shift}')

  expect(props.onExecute).not.toHaveBeenCalled()
})

test('sets isDirty to true when prompt is changed from initial value', async () => {
  const props = {
    ...defaultProps,
    prompt: 'initial prompt',
  }

  render(<UserPrompt {...props} />)

  const textarea = screen.getByRole('textbox')

  await userEvent.clear(textarea)
  await userEvent.type(textarea, 'changed prompt')

  await waitFor(() => {
    expect(mockSetActiveField).toHaveBeenCalledWith(expect.objectContaining({
      isDirty: true,
    }))
  })
})

test('sets isDirty to false when prompt is changed back to original value', async () => {
  const mockFieldWithDirtyTrue = {
    ...mockActiveField,
    isDirty: true,
  }

  useFieldCalibration.mockReturnValue({
    activeField: mockFieldWithDirtyTrue,
    setActiveField: mockSetActiveField,
  })

  const props = {
    ...defaultProps,
    prompt: 'different prompt',
  }

  render(<UserPrompt {...props} />)

  const textarea = screen.getByRole('textbox')

  await userEvent.clear(textarea)
  await userEvent.type(textarea, 'initial prompt')

  await waitFor(() => {
    expect(mockSetActiveField).toHaveBeenCalledWith(expect.objectContaining({
      isDirty: false,
    }))
  })

  useFieldCalibration.mockReturnValue({
    activeField: {
      ...mockActiveField,
      isDirty: false,
    },
    setActiveField: mockSetActiveField,
  })
})

test('does not update isDirty if it has not changed', async () => {
  const mockFieldWithDirtyTrue = {
    ...mockActiveField,
    isDirty: true,
  }

  useFieldCalibration.mockReturnValueOnce({
    activeField: mockFieldWithDirtyTrue,
    setActiveField: mockSetActiveField,
  })

  const props = {
    ...defaultProps,
    prompt: 'different prompt',
  }

  render(<UserPrompt {...props} />)

  const textarea = screen.getByRole('textbox')

  await userEvent.type(textarea, 'x')

  await waitFor(() => {
    expect(defaultProps.setPrompt).toHaveBeenCalled()
  })

  expect(mockSetActiveField).not.toHaveBeenCalled()
})

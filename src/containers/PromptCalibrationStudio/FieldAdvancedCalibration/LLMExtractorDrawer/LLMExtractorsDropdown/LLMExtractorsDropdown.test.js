
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Extractor } from '@/containers/PromptCalibrationStudio/viewModels'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { LLMExtractorsDropdown } from './LLMExtractorsDropdown'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/PromptCalibrationStudio/hooks', () => ({
  useFieldCalibration: jest.fn(() => ({
    extractors: mockExtractors,
  })),
}))

jest.mock('lodash/debounce', () =>
  jest.fn((fn) => {
    fn.cancel = jest.fn()
    return fn
  }),
)

jest.mock('./LLMExtractorsDropdown.styles', () => ({
  ...jest.requireActual('./LLMExtractorsDropdown.styles'),
  MenuItem: jest.fn(({ children, onClick }) => (
    <div
      data-testid={mockMenuItemId}
      onClick={() => onClick?.(mockExtractor2.id)}
    >
      {children}
    </div>
  )),
}))

const mockExtractor1 = new Extractor({
  id: 'extractor-1',
  name: 'GPT-4 Extractor',
  model: 'gpt-4',
  customInstruction: 'Test instruction 1',
  groupingFactor: 1,
  temperature: 0.5,
  topP: 1,
})

const mockExtractor2 = new Extractor({
  id: 'extractor-2',
  name: 'Claude Extractor',
  model: 'claude-3',
  customInstruction: 'Test instruction 2',
  groupingFactor: 2,
  temperature: 0.7,
  topP: 0.9,
})

const mockExtractor3 = new Extractor({
  id: 'extractor-3',
  name: 'Gemini Extractor',
  model: 'gemini-pro',
  customInstruction: 'Test instruction 3',
  groupingFactor: 1,
  temperature: 0.3,
  topP: 1,
})

const mockExtractors = [
  mockExtractor1,
  mockExtractor2,
  mockExtractor3,
]

const mockOnSelectExtractor = jest.fn()
const mockOnCreateExtractor = jest.fn()
const mockMenuItemId = 'menu-item'

const defaultProps = {
  selectedExtractor: mockExtractor1,
  onSelectExtractor: mockOnSelectExtractor,
  onCreateExtractor: mockOnCreateExtractor,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders dropdown button with selected extractor name', () => {
  render(<LLMExtractorsDropdown {...defaultProps} />)

  const button = screen.getByRole('button', {
    name: mockExtractor1.name,
  })

  expect(button).toBeInTheDocument()
})

test('shows dropdown menu when button is clicked', async () => {
  render(<LLMExtractorsDropdown {...defaultProps} />)

  const button = screen.getByRole('button', { name: mockExtractor1.name })

  await userEvent.click(button)

  const extractor1 = screen.getAllByTestId(mockMenuItemId, { name: mockExtractor1.name })
  const extractor2 = screen.getAllByTestId(mockMenuItemId, { name: mockExtractor2.name })
  const extractor3 = screen.getAllByTestId(mockMenuItemId, { name: mockExtractor3.name })

  expect(extractor1.length).toBeGreaterThanOrEqual(1)
  expect(extractor2.length).toBeGreaterThanOrEqual(1)
  expect(extractor3.length).toBeGreaterThanOrEqual(1)
})

test('renders all extractors in dropdown menu', async () => {
  render(<LLMExtractorsDropdown {...defaultProps} />)

  const button = screen.getByRole('button', {
    name: mockExtractor1.name,
  })

  await userEvent.click(button)

  await waitFor(() => {
    mockExtractors.forEach((extractor) => {
      const extractorItem = screen.getAllByText(extractor.name)

      expect(extractorItem.length).toBeGreaterThanOrEqual(1)
    })
  })
})

test('renders Create LLM Extractor button in dropdown menu', async () => {
  render(<LLMExtractorsDropdown {...defaultProps} />)

  const button = screen.getByRole('button', {
    name: mockExtractor1.name,
  })

  await userEvent.click(button)

  await waitFor(() => {
    const createLLMExtractorButton = screen.getAllByText(localize(Localization.CREATE_LLM_EXTRACTOR))[0]

    expect(createLLMExtractorButton).toBeInTheDocument()
  })
})

test('renders search input in dropdown menu', async () => {
  render(<LLMExtractorsDropdown {...defaultProps} />)

  const button = screen.getByRole('button', {
    name: mockExtractor1.name,
  })

  await userEvent.click(button)

  const searchInput = screen.getByRole('textbox')

  expect(searchInput).toBeInTheDocument()
})

test('filters extractors based on search input', async () => {
  render(<LLMExtractorsDropdown {...defaultProps} />)

  const button = screen.getByRole('button', {
    name: mockExtractor1.name,
  })

  await userEvent.click(button)

  await waitFor(() => {
    expect(screen.getAllByText(mockExtractor2.name)[0]).toBeInTheDocument()
  })

  const searchInput = screen.getByRole('textbox')

  await userEvent.type(searchInput, 'Claude')

  await waitFor(() => {
    const allExtractorItems = screen.getAllByTestId(mockMenuItemId)
    expect(allExtractorItems.length).toBe(6)
  })
})

test('shows all extractors when search input is cleared', async () => {
  render(<LLMExtractorsDropdown {...defaultProps} />)

  const button = screen.getByRole('button', {
    name: mockExtractor1.name,
  })

  await userEvent.click(button)

  await waitFor(() => {
    expect(screen.getAllByText(mockExtractor2.name)[0]).toBeInTheDocument()
  })

  const searchInput = screen.getByRole('textbox')

  await userEvent.type(searchInput, 'Claude')

  await waitFor(() => {
    const allExtractorItems = screen.getAllByTestId(mockMenuItemId)

    expect(allExtractorItems.length).toBe(6)
  })

  await userEvent.clear(searchInput)

  await waitFor(() => {
    const allExtractorItems = screen.getAllByTestId(mockMenuItemId)

    expect(allExtractorItems.length).toBe(10)
  })
})

test('calls onSelectExtractor with extractor id when extractor is selected from dropdown', async () => {
  render(<LLMExtractorsDropdown {...defaultProps} />)

  const button = screen.getByRole('button', {
    name: mockExtractor1.name,
  })

  await userEvent.click(button)

  const extractor2 = screen.getAllByTestId(mockMenuItemId, { name: mockExtractor2.name })

  await userEvent.click(extractor2[2])

  expect(mockOnSelectExtractor).toHaveBeenCalledTimes(1)
})

test('closes dropdown after extractor is selected', async () => {
  render(<LLMExtractorsDropdown {...defaultProps} />)

  const button = screen.getByRole('button', {
    name: mockExtractor1.name,
  })

  await userEvent.click(button)

  await waitFor(() => {
    const searchInput = screen.getByRole('textbox')
    expect(searchInput).toBeInTheDocument()
  })

  const extractor2 = screen.getAllByTestId(mockMenuItemId, { name: mockExtractor2.name })
  await userEvent.click(extractor2[2])

  expect(mockOnSelectExtractor).toHaveBeenCalled()
})

test('calls onCreateExtractor when Create LLM Extractor button is clicked', async () => {
  render(<LLMExtractorsDropdown {...defaultProps} />)

  const button = screen.getByRole('button', {
    name: mockExtractor1.name,
  })

  await userEvent.click(button)

  await waitFor(() => {
    const createButton = screen.getAllByText(localize(Localization.CREATE_LLM_EXTRACTOR))[0]
    expect(createButton).toBeInTheDocument()
  })

  const createButton = screen.getAllByText(localize(Localization.CREATE_LLM_EXTRACTOR))[0]
  await userEvent.click(createButton)

  expect(mockOnCreateExtractor).toHaveBeenCalledTimes(1)
})

test('closes dropdown after Create LLM Extractor button is clicked', async () => {
  render(<LLMExtractorsDropdown {...defaultProps} />)

  const button = screen.getByRole('button', {
    name: mockExtractor1.name,
  })

  await userEvent.click(button)

  await waitFor(() => {
    const searchInput = screen.getByRole('textbox')
    expect(searchInput).toBeInTheDocument()
  })

  const createButton = screen.getAllByText(localize(Localization.CREATE_LLM_EXTRACTOR))[0]
  await userEvent.click(createButton)

  expect(mockOnCreateExtractor).toHaveBeenCalledTimes(1)
})

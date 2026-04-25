
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event'
import { LLMModelContextType } from '@/enums/LLMModelContextType'
import {
  LLModel,
  LLMProvider,
  LLMSettings,
} from '@/models/LLMProvider'
import { render } from '@/utils/rendererRTL'
import { LLMSettingsDropdown } from './LLMSettingsDropdown'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('./LLMSettingsDropdown.styles', () => ({
  ...jest.requireActual('./LLMSettingsDropdown.styles'),
  CloseIcon: () => <span data-testid='close-icon' />,
  ExpandIcon: () => <span data-testid='expand-icon' />,
  Collapse: ({ renderPanels, renderExpandButton }) => (
    <div data-testid='collapse'>
      {renderPanels()}
      {renderExpandButton({ isActive: false }, jest.fn())}
    </div>
  ),
  Panel: ({ header, children }) => (
    <div data-testid='panel'>
      <div data-testid='panel-header'>{header}</div>
      <div data-testid='panel-content'>{children}</div>
    </div>
  ),
}))

const activeModel = new LLModel({
  name: 'Model Name',
  code: 'modelCode',
  description: '',
  contextType: LLMModelContextType.TEXT_BASED,
})

const mockProvider = new LLMProvider({
  code: 'providerCode',
  name: 'Provider Name',
  models: [
    activeModel,
    new LLModel({
      name: 'Model Name 1',
      code: 'modelCode1',
      description: '',
      contextType: LLMModelContextType.TEXT_BASED,
    }),
    new LLModel({
      name: 'Model Name 2',
      code: 'modelCode2',
      description: '',
      contextType: LLMModelContextType.TEXT_BASED,
    }),
  ],
})

const mockLLMSettings = new LLMSettings({
  model: activeModel.code,
  provider: mockProvider.code,
})

const mockRenderTrigger = () => <button data-testid='custom-trigger' />

test('renders trigger correctly', () => {
  render(
    <LLMSettingsDropdown
      activeLLMSettings={mockLLMSettings}
      disabled={false}
      isVisible={false}
      onModelSelect={jest.fn()}
      onVisibleChange={jest.fn()}
      providers={[mockProvider]}
      renderTrigger={mockRenderTrigger}
    />,
  )

  expect(screen.getByTestId('custom-trigger')).toBeInTheDocument()
})

test('disables trigger if disable prop is true', async () => {
  render(
    <LLMSettingsDropdown
      activeLLMSettings={mockLLMSettings}
      disabled={true}
      isVisible={false}
      onModelSelect={jest.fn()}
      onVisibleChange={jest.fn()}
      providers={[mockProvider]}
      renderTrigger={mockRenderTrigger}
    />,
  )

  expect(screen.getByTestId('custom-trigger')).toBeDisabled()
})

test('renders dropdown with correct layout', () => {
  render(
    <LLMSettingsDropdown
      activeLLMSettings={mockLLMSettings}
      disabled={false}
      isVisible={true}
      onModelSelect={jest.fn()}
      onVisibleChange={jest.fn()}
      providers={[mockProvider]}
      renderTrigger={mockRenderTrigger}
    />,
  )

  const panelHeader = screen.getByTestId('panel-header')
  const panelContent = screen.getByTestId('panel-content')

  expect(screen.getByTestId('collapse')).toBeInTheDocument()
  expect(screen.getByTestId('panel')).toBeInTheDocument()
  expect(screen.getByTestId('expand-icon')).toBeInTheDocument()
  expect(panelHeader).toHaveTextContent(mockProvider.name)
  expect(panelHeader).toHaveTextContent(activeModel.name)
  expect(panelContent).toHaveTextContent(mockProvider.models[1].name)
  expect(panelContent).toHaveTextContent(mockProvider.models[2].name)
})

test('calls onModelSelect with correct arguments when a model is clicked', async () => {
  const mockOnModelSelect = jest.fn()
  const selectedModel = mockProvider.models[1]

  render(
    <LLMSettingsDropdown
      activeLLMSettings={mockLLMSettings}
      disabled={false}
      isVisible={true}
      onModelSelect={mockOnModelSelect}
      onVisibleChange={jest.fn()}
      providers={[mockProvider]}
      renderTrigger={mockRenderTrigger}
    />,
  )

  await userEvent.click(screen.getByText(selectedModel.name), {
    pointerEventsCheck: PointerEventsCheckLevel.Never,
  })

  expect(mockOnModelSelect).nthCalledWith(1, mockProvider.code, selectedModel.code)
})

test('calls onVisibleChange when trigger is clicked', async () => {
  const mockOnVisibleChange = jest.fn()

  render(
    <LLMSettingsDropdown
      activeLLMSettings={mockLLMSettings}
      disabled={false}
      isVisible={false}
      onModelSelect={jest.fn()}
      onVisibleChange={mockOnVisibleChange}
      providers={[mockProvider]}
      renderTrigger={mockRenderTrigger}
    />,
  )

  await userEvent.click(screen.getByTestId('custom-trigger'))
  expect(mockOnVisibleChange).nthCalledWith(1, true)
})

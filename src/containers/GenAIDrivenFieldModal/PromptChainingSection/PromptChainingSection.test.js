
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TEST_ID } from '@/containers/GenAIDrivenFieldModal/constants'
import { Localization, localize } from '@/localization/i18n'
import {
  LLMExtractionQueryWorkflow,
  LLMExtractionQueryNode,
  LLMExtractionQueryEdge,
} from '@/models/LLMExtractor'
import { render } from '@/utils/rendererRTL'
import { PromptChainingSection } from './PromptChainingSection'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid'),
}))

jest.mock('./ActiveNodePrompt', () => ({
  ActiveNodePrompt: ({ onChange }) => (
    <input
      data-testid={activeNodePromptTestId}
      onChange={onChange}
    />
  ),
}))

const activeNodePromptTestId = 'active-node-prompt'
const mockUuid = 'mock-uuid'

test('renders AddFirstNodeButton when no nodes exist', () => {
  const handleChange = jest.fn()

  render(
    <PromptChainingSection
      onChange={handleChange}
      value={undefined}
    />,
  )

  const addButton = screen.getByRole('button', {
    name: localize(Localization.ADD_PROMPT),
  })

  expect(addButton).toBeInTheDocument()
})

test('clicking "AddFirstNodeButton" adds a new node', async () => {
  const user = userEvent.setup()
  const handleChange = jest.fn()

  render(
    <PromptChainingSection
      onChange={handleChange}
      value={undefined}
    />,
  )

  const addButton = screen.getByRole('button', {
    name: localize(Localization.ADD_PROMPT),
  })
  await user.click(addButton)

  expect(handleChange).nthCalledWith(1, {
    nodes: [
      new LLMExtractionQueryNode({
        id: mockUuid,
        name: 'Prompt Block 1',
        prompt: '',
      }),
    ],
    edges: [],
    startNodeId: mockUuid,
    endNodeId: mockUuid,
  })
})

test('renders nodes when nodes exist', () => {
  const mockNodeName = 'Node 1'
  const llmWorkflow = new LLMExtractionQueryWorkflow({
    nodes: [
      new LLMExtractionQueryNode({
        id: mockUuid,
        name: mockNodeName,
        prompt: '',
      }),
    ],
    edges: [],
    startNodeId: mockUuid,
    endNodeId: mockUuid,
  })
  const handleChange = jest.fn()

  render(
    <PromptChainingSection
      onChange={handleChange}
      value={llmWorkflow}
    />,
  )

  const [nodeNameElement] = screen.getAllByText(mockNodeName)
  expect(nodeNameElement).toBeInTheDocument()
})

test('typing in prompt input updates active node prompt', async () => {
  const user = userEvent.setup()
  const mockNodeName = 'Node 1'
  const mockNode = new LLMExtractionQueryNode({
    id: 'mock-uuid',
    name: mockNodeName,
    prompt: '',
  })
  const llmWorkflow = new LLMExtractionQueryWorkflow({
    nodes: [mockNode],
    edges: [],
    startNodeId: mockUuid,
    endNodeId: mockUuid,
  })

  const handleChange = jest.fn()

  render(
    <PromptChainingSection
      onChange={handleChange}
      value={llmWorkflow}
    />,
  )

  const input = screen.getByTestId(activeNodePromptTestId)
  const mockPrompt = 'Hello'
  await user.click(input)
  await user.paste(mockPrompt)

  const lastCall = handleChange.mock.calls.pop()[0]
  expect(lastCall.nodes[0].prompt).toBe(mockPrompt)
})

test('calls onChange with correct args on node delete', async () => {
  const mockNode1 = new LLMExtractionQueryNode({
    id: 'mock-uuid-1',
    name: 'mock-node-1',
    prompt: 'mock prompt 1',
  })

  const mockNode2 = new LLMExtractionQueryNode({
    id: 'mock-uuid-2',
    name: 'mock-node-2',
    prompt: 'mock prompt 2',
  })

  const llmWorkflow = new LLMExtractionQueryWorkflow({
    nodes: [mockNode1, mockNode2],
    edges: [
      new LLMExtractionQueryEdge({
        sourceId: 'mock-uuid-1',
        targetId: 'mock-uuid-2',
      }),
    ],
    startNodeId: mockUuid,
    endNodeId: mockUuid,
  })

  const handleChange = jest.fn()

  render(
    <PromptChainingSection
      onChange={handleChange}
      value={llmWorkflow}
    />,
  )

  const [node] = screen.getAllByTestId(TEST_ID.NODE_ITEM)

  await userEvent.hover(node)
  await userEvent.click(screen.getByTestId(TEST_ID.DELETE_NODE_BUTTON))

  expect(handleChange).nthCalledWith(1, {
    nodes: [mockNode2],
    startNodeId: mockNode2.id,
    endNodeId: mockNode2.id,
    edges: [],
  })
})

test('calls onChange with correct args on node rename', async () => {
  const currentNodeName = 'node name'
  const newNodeName = 'new-name'

  const mockNode = new LLMExtractionQueryNode({
    id: mockUuid,
    name: currentNodeName,
    prompt: 'mock prompt 1',
  })

  const llmWorkflow = new LLMExtractionQueryWorkflow({
    nodes: [mockNode],
    edges: [],
    startNodeId: mockUuid,
    endNodeId: mockUuid,
  })

  const handleChange = jest.fn()

  render(
    <PromptChainingSection
      onChange={handleChange}
      value={llmWorkflow}
    />,
  )

  const [node] = screen.getAllByTestId(TEST_ID.NODE_ITEM)
  await userEvent.dblClick(node)

  const nodeNameInput = screen.getByDisplayValue(currentNodeName)
  await userEvent.clear(nodeNameInput)
  await userEvent.type(nodeNameInput, newNodeName)
  await userEvent.tab()

  expect(handleChange).nthCalledWith(1, {
    nodes: [{
      ...mockNode,
      name: newNodeName,
    }],
    startNodeId: mockUuid,
    endNodeId: mockUuid,
    edges: [],
  })
})

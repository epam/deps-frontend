
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Position, TEST_ID } from '@/containers/GenAIDrivenFieldModal/constants'
import { Localization, localize } from '@/localization/i18n'
import { LLMExtractionQueryNode } from '@/models/LLMExtractor'
import { render } from '@/utils/rendererRTL'
import { NodesBuilder } from './NodesBuilder'

jest.mock('@/utils/env', () => mockEnv)

const nodes = [
  new LLMExtractionQueryNode({
    id: '1',
    name: 'name1',
    prompt: 'prompt1',
  }),
  new LLMExtractionQueryNode({
    id: '2',
    name: 'name2',
    prompt: '',
  }),
]

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders nodes and add buttons correctly', () => {
  render(
    <NodesBuilder
      activeNodeId={'1'}
      nodes={nodes}
      onAdd={jest.fn()}
      onClick={jest.fn()}
      onDelete={jest.fn()}
      onRename={jest.fn()}
    />,
  )

  const nodeElements = screen.getAllByTestId(TEST_ID.NODE_ITEM)
  expect(nodeElements).toHaveLength(nodes.length)

  nodes.forEach((node) => {
    const [nodeNameElement] = screen.getAllByText(node.name)
    expect(nodeNameElement).toBeInTheDocument()
  })

  const addButtons = screen.getAllByTestId(TEST_ID.ADD_NEW_NODE_BUTTON)
  expect(addButtons).toHaveLength(2)
})

test('renders connection lines between nodes', () => {
  render(
    <NodesBuilder
      activeNodeId={'1'}
      nodes={nodes}
      onAdd={jest.fn()}
      onClick={jest.fn()}
      onDelete={jest.fn()}
      onRename={jest.fn()}
    />,
  )

  const connectionLines = screen.getAllByTestId(TEST_ID.NODES_CONNECTION)
  expect(connectionLines).toHaveLength(nodes.length - 1)
})

test('calls onClick when a node item is clicked', async () => {
  const onClick = jest.fn()
  const user = userEvent.setup()

  render(
    <NodesBuilder
      activeNodeId={'1'}
      nodes={nodes}
      onAdd={jest.fn()}
      onClick={onClick}
      onDelete={jest.fn()}
      onRename={jest.fn()}
    />,
  )

  const [node] = screen.getAllByTestId(TEST_ID.NODE_ITEM)
  await user.click(node)

  expect(onClick).nthCalledWith(1, nodes[0].id)
})

test('allows deleting a node if it is not the only node', async () => {
  const onDelete = jest.fn()

  render(
    <NodesBuilder
      activeNodeId={'1'}
      nodes={nodes}
      onAdd={jest.fn()}
      onClick={jest.fn()}
      onDelete={onDelete}
      onRename={jest.fn()}
    />,
  )

  const [node] = screen.getAllByTestId(TEST_ID.NODE_ITEM)

  await userEvent.hover(node)
  await userEvent.click(screen.getByTestId(TEST_ID.DELETE_NODE_BUTTON))

  expect(onDelete).toHaveBeenCalled()
})

test('disallows deleting a node if it is the only node', async () => {
  const onDelete = jest.fn()

  render(
    <NodesBuilder
      activeNodeId={'1'}
      nodes={
        [
          new LLMExtractionQueryNode({
            id: '1',
            name: 'name1',
            prompt: 'prompt1',
          }),
        ]
      }
      onAdd={jest.fn()}
      onClick={jest.fn()}
      onDelete={onDelete}
      onRename={jest.fn()}
    />,
  )

  const [node] = screen.getAllByTestId(TEST_ID.NODE_ITEM)

  await userEvent.hover(node)

  expect(screen.queryByTestId(TEST_ID.DELETE_NODE_BUTTON)).not.toBeInTheDocument()
})

test('shows error message for nodes without prompt', async () => {
  render(
    <NodesBuilder
      activeNodeId={'1'}
      nodes={nodes}
      onAdd={jest.fn()}
      onClick={jest.fn()}
      onDelete={jest.fn()}
      onRename={jest.fn()}
    />,
  )

  const [addButton] = screen.getAllByTestId(TEST_ID.ADD_NEW_NODE_BUTTON)

  await userEvent.click(addButton)
  const errorMessage = screen.getByText(`(${localize(Localization.ENTER_PROMPT)})`)

  expect(errorMessage).toBeInTheDocument()
})

test('calls onAdd with correct index and position when Add button clicked', async () => {
  const onAdd = jest.fn()
  const user = userEvent.setup()

  render(
    <NodesBuilder
      activeNodeId={'1'}
      nodes={nodes}
      onAdd={onAdd}
      onClick={jest.fn()}
      onDelete={jest.fn()}
      onRename={jest.fn()}
    />,
  )

  const addButtons = screen.getAllByTestId(TEST_ID.ADD_NEW_NODE_BUTTON)

  await user.click(addButtons[0])
  expect(onAdd).toHaveBeenCalledWith({
    index: 0,
    position: Position.BEFORE,
  })

  await user.click(addButtons[1])
  expect(onAdd).toHaveBeenCalledWith({
    index: 1,
    position: Position.AFTER,
  })
})

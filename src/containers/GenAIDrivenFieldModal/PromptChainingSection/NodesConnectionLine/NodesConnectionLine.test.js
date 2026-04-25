
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TEST_ID } from '@/containers/GenAIDrivenFieldModal/constants'
import { render } from '@/utils/rendererRTL'
import { NodesConnectionLine } from './NodesConnectionLine'

jest.mock('@/utils/env', () => mockEnv)

test('renders vertical line by default', () => {
  render(
    <NodesConnectionLine
      onAdd={jest.fn()}
    />,
  )

  expect(screen.getByTestId(TEST_ID.NODE_VERTICAL_LINE)).toBeInTheDocument()
  expect(screen.queryByTestId(TEST_ID.ADD_NEW_NODE_BUTTON)).not.toBeInTheDocument()
})

test('shows AddNewNodeButton on hover', async () => {
  render(
    <NodesConnectionLine
      onAdd={jest.fn()}
    />,
  )

  const lineContainer = screen.getByTestId(TEST_ID.NODES_CONNECTION)
  const user = userEvent.setup()

  await user.hover(lineContainer)
  expect(screen.getByTestId(TEST_ID.ADD_NEW_NODE_BUTTON)).toBeInTheDocument()
  expect(screen.queryByTestId(TEST_ID.NODE_VERTICAL_LINE)).not.toBeInTheDocument()

  await user.unhover(lineContainer)
  expect(screen.getByTestId(TEST_ID.NODE_VERTICAL_LINE)).toBeInTheDocument()
  expect(screen.queryByTestId(TEST_ID.ADD_NEW_NODE_BUTTON)).not.toBeInTheDocument()
})

test('calls onAdd when AddNewNodeButton is clicked', async () => {
  const onAddMock = jest.fn()

  render(
    <NodesConnectionLine
      onAdd={onAddMock}
    />,
  )

  const lineContainer = screen.getByTestId(TEST_ID.NODE_VERTICAL_LINE)
  await userEvent.hover(lineContainer)

  const button = screen.getByTestId(TEST_ID.ADD_NEW_NODE_BUTTON)
  await userEvent.click(button)

  expect(onAddMock).toHaveBeenCalled()
})

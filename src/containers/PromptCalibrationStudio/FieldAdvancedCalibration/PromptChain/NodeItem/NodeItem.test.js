
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryNode } from '@/containers/PromptCalibrationStudio/viewModels'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { NodeItem } from './NodeItem'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Icons/PenIcon', () => mockShallowComponent('PenIcon'))
jest.mock('@/components/Icons/TrashIcon', () => mockShallowComponent('TrashIcon'))

beforeEach(() => {
  jest.clearAllMocks()
})

const mockNode = new QueryNode({
  id: 'node-1',
  name: 'Node 1',
  prompt: 'Prompt 1',
})

const defaultProps = {
  node: mockNode,
  onDelete: jest.fn(),
  onEdit: jest.fn(),
  isDeleteHidden: false,
  promptNumber: 1,
}

test('renders with given node name and prompt', () => {
  render(<NodeItem {...defaultProps} />)

  const nameElement = screen.getByText(mockNode.name)
  const promptElement = screen.getByText(mockNode.prompt)

  expect(nameElement).toBeInTheDocument()
  expect(promptElement).toBeInTheDocument()
})

test('renders prompt number', () => {
  const promptNumber = 3

  render(
    <NodeItem
      {...defaultProps}
      promptNumber={promptNumber}
    />,
  )

  const promptNumberElement = screen.getByText(promptNumber.toString())

  expect(promptNumberElement).toBeInTheDocument()
})

test('calls onEdit with id when edit button is clicked', async () => {
  render(<NodeItem {...defaultProps} />)

  const editButton = screen.getByTestId('PenIcon')

  await userEvent.click(editButton)

  expect(defaultProps.onEdit).toHaveBeenNthCalledWith(1, mockNode.id)
})

test('calls onDelete with id when delete button is clicked', async () => {
  render(<NodeItem {...defaultProps} />)

  const deleteButton = screen.getByTestId('TrashIcon')

  await userEvent.click(deleteButton)

  await userEvent.click(screen.getByRole('button', { name: localize(Localization.OK) }))

  expect(defaultProps.onDelete).toHaveBeenCalledWith(mockNode.id)
})

test('does not render delete button if isDeleteHidden is true', async () => {
  const props = {
    ...defaultProps,
    isDeleteHidden: true,
  }

  render(<NodeItem {...props} />)

  const deleteButton = screen.queryByTestId('TrashIcon')

  expect(deleteButton).not.toBeInTheDocument()
})

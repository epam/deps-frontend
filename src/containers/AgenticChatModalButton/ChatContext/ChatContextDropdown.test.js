
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { localize, Localization } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { ChatContextDropdown } from './ChatContextDropdown'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('./ChatContextDropdown.styles', () => ({
  ...jest.requireActual('./ChatContextDropdown.styles'),
  PlusIcon: () => <span data-testid='plus-icon' />,
  CheckIcon: () => <span data-testid='check-icon' />,
}))

const mockToolsList = [
  {
    id: 'id1',
    isSelected: true,
    name: 'Tool1',
  },
  {
    id: 'id2',
    isSelected: true,
    name: 'Tool2',
  },
  {
    id: 'id3',
    isSelected: false,
    name: 'Tool3',
  },
]

test('renders trigger correctly', () => {
  render(
    <ChatContextDropdown
      disabled={false}
      onToolSelect={jest.fn()}
      toolsList={mockToolsList}
    />,
  )

  expect(screen.getByRole('button')).toBeInTheDocument()
  expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
})

test('shows tooltip on trigger hover', async () => {
  render(
    <ChatContextDropdown
      disabled={false}
      onToolSelect={jest.fn()}
      toolsList={mockToolsList}
    />,
  )

  const trigger = screen.getByTestId('plus-icon')
  await userEvent.hover(trigger)

  await waitFor(() => {
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent(localize(Localization.ADD_CONTEXT))
  })
})

test('disables trigger if disable prop is true', () => {
  render(
    <ChatContextDropdown
      disabled={true}
      onToolSelect={jest.fn()}
      toolsList={mockToolsList}
    />,
  )

  expect(screen.getByRole('button')).toBeDisabled()
})

test('renders tools list correctly on trigger click', async () => {
  render(
    <ChatContextDropdown
      disabled={false}
      onToolSelect={jest.fn()}
      toolsList={mockToolsList}
    />,
  )

  const trigger = screen.getByTestId('plus-icon')
  await userEvent.click(trigger)

  const items = screen.getAllByRole('listitem')

  mockToolsList.forEach((tool, i) => {
    const checkIcon = within(items[i]).queryByTestId('check-icon')

    if (tool.isSelected) {
      expect(checkIcon).toBeInTheDocument()
    } else {
      expect(checkIcon).not.toBeInTheDocument()
    }

    expect(items[i]).toHaveTextContent(tool.name)
  })
})

test('calls onToolSelect with correct argument on tool click', async () => {
  const mockOnToolSelect = jest.fn()

  render(
    <ChatContextDropdown
      disabled={false}
      onToolSelect={mockOnToolSelect}
      toolsList={mockToolsList}
    />,
  )

  const trigger = screen.getByTestId('plus-icon')
  await userEvent.click(trigger)

  const selectedTool = screen.getByText(mockToolsList[0].name)
  await userEvent.click(selectedTool)

  expect(mockOnToolSelect).nthCalledWith(1, mockToolsList[0].id)
})

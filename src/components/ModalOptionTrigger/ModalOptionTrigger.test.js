
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/utils/rendererRTL'
import { ModalOptionTrigger } from './ModalOptionTrigger'

const mockTitle = 'title'
const mockDescription = 'description text'

jest.mock('@/utils/env', () => mockEnv)

test('shows correct content', async () => {
  const mockOnClickHandler = jest.fn()

  render(
    <ModalOptionTrigger
      description={mockDescription}
      isDisabled={false}
      onClick={mockOnClickHandler}
      title={mockTitle}
    />,
  )

  const title = screen.getByRole('heading', {
    level: 3,
    name: mockTitle,
  })

  const description = screen.getByText(mockDescription)

  expect(title).toBeInTheDocument()
  expect(description).toBeInTheDocument()

  await userEvent.click(title)

  expect(mockOnClickHandler).toHaveBeenCalled()
})

test('shows disabled item if isDisabled prop is true', async () => {
  const mockOnClickHandler = jest.fn()

  render(
    <ModalOptionTrigger
      description={mockDescription}
      isDisabled={true}
      onClick={mockOnClickHandler}
      title={mockTitle}
    />,
  )

  const title = screen.getByRole('heading', {
    level: 3,
    name: mockTitle,
  })

  expect(title).toBeInTheDocument()

  await userEvent.click(title)

  expect(mockOnClickHandler).not.toHaveBeenCalled()
})

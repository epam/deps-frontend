
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/utils/rendererRTL'
import { MentionOption } from './MentionOption'
import { MentionsField } from './MentionsField'

jest.mock('@/utils/env', () => mockEnv)

const sampleData = [
  new MentionOption({
    id: '1',
    display: 'FieldOne',
  }),
  new MentionOption({
    id: '2',
    display: 'FieldTwo',
  }),
]

const mockPlaceholder = 'Type here...'

const defaultProps = {
  value: '',
  onChange: jest.fn(),
  placeholder: mockPlaceholder,
  data: sampleData,
  allowSpaceInQuery: true,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders with placeholder', () => {
  render(<MentionsField {...defaultProps} />)
  expect(screen.getByPlaceholderText(mockPlaceholder)).toBeInTheDocument()
})

test('renders with initial value', () => {
  const mockValue = 'Initial text'

  render(
    <MentionsField
      {...defaultProps}
      value="Initial text"
    />,
  )
  expect(screen.getByDisplayValue(mockValue)).toBeInTheDocument()
})

test('calls onChange when typing', async () => {
  render(<MentionsField {...defaultProps} />)
  const input = screen.getByRole('textbox')

  await userEvent.type(input, '@')

  expect(defaultProps.onChange).toHaveBeenCalled()
})


import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { Tag } from '@/models/Tag'
import { render } from '@/utils/rendererRTL'
import { LongTagsList } from './LongTagsList'

jest.mock('@/utils/env', () => mockEnv)

const tags = [
  new Tag({
    id: 'tag1',
    text: 'Tag1',
  }),
  new Tag({
    id: 'tag2',
    text: 'Tag2',
  }),
]

jest.mock('@/components/Dropdown', () => ({
  Dropdown: ({ dropdownRender, children }) => (
    <div data-testtid={'dropdown'}>
      {children}
      {dropdownRender()}
    </div>
  ),
}))

jest.mock('@/components/LongText', () => ({
  LongText: jest.fn(({ text }) => text),
}))

jest.spyOn(HTMLDivElement.prototype, 'offsetWidth', 'get')
  .mockImplementation(() => 200)
jest.spyOn(HTMLSpanElement.prototype, 'offsetWidth', 'get')
  .mockImplementation(() => 10)

let user

beforeEach(() => {
  jest.clearAllMocks()
  jest.useFakeTimers()
  user = userEvent.setup({
    advanceTimers: jest.advanceTimersByTime,
  })
})

afterEach(() => {
  jest.useRealTimers()
})

test('shows the correct number of tags if all tags are visible', () => {
  render(<LongTagsList tags={tags} />)
  const renderedTags = screen.getAllByText(/Tag/)
  const hiddenTagsDropdown = screen.queryByTestId('dropdown')

  expect(hiddenTagsDropdown).not.toBeInTheDocument()
  expect(renderedTags.length).toEqual(tags.length)
})

test('shows hidden tags when user hovers item with hidden tags number', async () => {
  render(
    <LongTagsList
      offset={200}
      tags={tags}
    />,
  )
  const showAllButton = screen.getByText(`+ ${tags.length}`)
  await user.hover(showAllButton)
  const renderedTags = screen.getAllByText(/Tag/)

  expect(renderedTags.length).toBe(tags.length)
})

test('calls onTagClick prop on tag click', async () => {
  const mockOnClick = jest.fn()

  render(
    <LongTagsList
      onTagClick={mockOnClick}
      tags={tags}
    />,
  )

  const [tag1] = screen.getAllByTestId('tag')
  await user.click(tag1)

  expect(mockOnClick).toHaveBeenCalled()
})

test('calls onTagClose prop with correct argument on tag close icon click', async () => {
  const mockOnClose = jest.fn()

  render(
    <LongTagsList
      isTagClosable={true}
      onTagClose={mockOnClose}
      tags={tags}
    />,
  )

  const [closeIcon1] = screen.getAllByTestId('close-icon')
  await user.click(closeIcon1)

  expect(mockOnClose).nthCalledWith(1, tags[0])
})

test('calls renderVisibleTagContent with correct argument to render tag content if prop is passed', async () => {
  jest.clearAllMocks()

  const mockRenderVisibleTagContent = jest.fn(() => <div data-testid='custom-tag-content' />)

  render(
    <LongTagsList
      renderVisibleTagContent={mockRenderVisibleTagContent}
      tags={tags}
    />,
  )

  const renderedTags = screen.getAllByTestId('custom-tag-content')

  expect(renderedTags.length).toBe(tags.length)
  expect(mockRenderVisibleTagContent).nthCalledWith(1, tags[0])
  expect(mockRenderVisibleTagContent).nthCalledWith(2, tags[1])
})


import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  PrototypeTableHeader,
  PrototypeTabularMapping,
  TableHeaderType,
} from '@/models/PrototypeTableField'
import { render } from '@/utils/rendererRTL'
import { MappingHeaders } from './MappingHeaders'

jest.mock('@/components/Icons/TagIcon', () => mockShallowComponent('TagIcon'))
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/components/Badge', () => ({
  Badge: ({ count }) => (
    <span data-testid="aliases-count">
      {count}
    </span>
  ),
}))

const createHeaders = (count) => (
  Array.from({ length: count }, (_, i) => (
    new PrototypeTableHeader({
      name: `Header${i + 1}`,
      aliases: [`alias${i + 1}a`, `alias${i + 1}b`],
    })
  ),
  ))

const MAX_VISIBLE_HEADERS = 3
const ALIASES_COUNT = 2

const setup = ({
  headers = createHeaders(MAX_VISIBLE_HEADERS),
  updateHeaders = jest.fn(),
  isEditMode = true,
} = {}) => {
  const tabularMapping = new PrototypeTabularMapping({
    headerType: TableHeaderType.ROWS,
    headers,
    occurrenceIndex: 1,
  })

  const props = {
    tabularMapping,
    updateHeaders,
    isEditMode,
  }

  render(
    <MappingHeaders {...props} />,
  )

  return props
}

test('renders visible headers up to MAX_VISIBLE_HEADERS', () => {
  setup()

  const header1 = screen.getByText('Header1')
  const header2 = screen.getByText('Header2')
  const header3 = screen.getByText('Header3')

  expect(header1).toBeInTheDocument()
  expect(header2).toBeInTheDocument()
  expect(header3).toBeInTheDocument()
})

test('hides excess headers in tooltip trigger', () => {
  setup({ headers: createHeaders(MAX_VISIBLE_HEADERS + 1) })

  expect(screen.getByText('+1')).toBeInTheDocument()
})

test('does not render hidden section if all headers fit in visible', () => {
  setup({ headers: createHeaders(MAX_VISIBLE_HEADERS) })

  expect(screen.queryByText('+')).not.toBeInTheDocument()
})

test('calls updateHeaders when a header is removed', async () => {
  const { updateHeaders } = setup()
  const [header] = screen.getAllByTestId('tag')

  const closeButton = within(header).getByTestId('close-icon')

  await userEvent.click(closeButton)

  expect(updateHeaders).toHaveBeenCalledTimes(1)
})

test('does not allow removing header if only one is present', () => {
  setup({ headers: createHeaders(1) })

  const [header] = screen.getAllByTestId('tag')
  const closeButton = within(header).queryByTestId('close-icon')

  expect(closeButton).not.toBeInTheDocument()
})

test('does not allow removing header if it is not edit mode', () => {
  setup({
    isEditMode: false,
  })

  const [header] = screen.getAllByTestId('tag')
  const closeButton = within(header).queryByTestId('close-icon')

  expect(closeButton).not.toBeInTheDocument()
})

test('shows correct aliases count per header', () => {
  setup()

  const counts = screen.getAllByTestId('aliases-count')
  counts.forEach((count) => {
    expect(count).toHaveTextContent(ALIASES_COUNT)
  })
})

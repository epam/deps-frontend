
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { localize, Localization } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { PageRangeSelectors } from './PageRangeSelectors'

const mockDocumentPagesQuantity = 4
const mockDocumentPages = ['1', '2', '3', '4']

jest.mock('@/utils/env', () => mockEnv)

const MockSelect = ({
  onChange,
  options,
  value,
}) => {
  const onChangeHandler = (e) => {
    onChange(e.target.value)
  }

  return (
    <select
      onChange={onChangeHandler}
      value={value}
    >
      {
        options.map(({ value, text, disabled }) => (
          <option
            key={value}
            disabled={disabled}
            value={value}
          >
            {text}
          </option>
        ))
      }
    </select>
  )
}

jest.mock('../PageSelector', () => ({
  PageSelector: (props) => <MockSelect {...props} />,
}))

test('show Page Range selectors with all layouts', async () => {
  const mockPageRange = ['2', '3']

  render(
    <PageRangeSelectors
      documentPages={mockDocumentPages}
      isPageRangeValid={true}
      onChangeEndPage={jest.fn()}
      onChangeStartPage={jest.fn()}
      pageRange={mockPageRange}
    />,
  )

  expect(await screen.findByText(localize(Localization.START_PAGE))).toBeInTheDocument()
  expect(await screen.findByText(localize(Localization.END_PAGE))).toBeInTheDocument()
  expect(screen.getAllByRole('combobox')).toHaveLength(mockPageRange.length)
})

test('Start Page selector contains all document pages as options and disable options which are more than end page value', async () => {
  const mockPageRange = ['2', '3']
  const [, mockEndPage] = mockPageRange

  render(
    <PageRangeSelectors
      documentPages={mockDocumentPages}
      isPageRangeValid={true}
      onChangeEndPage={jest.fn()}
      onChangeStartPage={jest.fn()}
      pageRange={mockPageRange}
    />,
  )

  const [startPage] = screen.getAllByRole('combobox')

  mockDocumentPages.forEach((page, i) => {
    expect(startPage.options[i]).toHaveValue(page)
    expect(startPage.options[i]).toHaveTextContent(page)

    if (+page > +mockEndPage) {
      expect(startPage.options[i]).toBeDisabled()
    }
  })
})

test('End Page selector contains all document pages as options and disable options which are less than start page value', async () => {
  const mockPageRange = ['2', '3']
  const [mockStartPage] = mockPageRange

  render(
    <PageRangeSelectors
      documentPages={mockDocumentPages}
      isPageRangeValid={true}
      onChangeEndPage={jest.fn()}
      onChangeStartPage={jest.fn()}
      pageRange={mockPageRange}
    />,
  )

  const [, endPage] = screen.getAllByRole('combobox')

  mockDocumentPages.forEach((page, i) => {
    expect(endPage.options[i]).toHaveValue(page)
    expect(endPage.options[i]).toHaveTextContent(page)

    if (+page < +mockStartPage) {
      expect(endPage.options[i]).toBeDisabled()
    }
  })
})

test('call onChangeStartPage with proper value if user selected start page', async () => {
  const mockOnChangeStartPage = jest.fn()

  render(
    <PageRangeSelectors
      documentPages={mockDocumentPages}
      isPageRangeValid={true}
      onChangeEndPage={jest.fn()}
      onChangeStartPage={mockOnChangeStartPage}
      pageRange={['2', '3']}
    />,
  )

  const [startPage] = screen.getAllByRole('combobox')
  const firstOption = startPage.options[0]

  await userEvent.selectOptions(
    startPage,
    firstOption,
  )

  expect(mockOnChangeStartPage).nthCalledWith(1, firstOption.value)
})

test('call onChangeEndPage with proper value if user selected end page', async () => {
  const mockOnChangeEndPage = jest.fn()

  render(
    <PageRangeSelectors
      documentPages={mockDocumentPages}
      isPageRangeValid={true}
      onChangeEndPage={mockOnChangeEndPage}
      onChangeStartPage={jest.fn()}
      pageRange={['2', '3']}
    />,
  )

  const [, endPage] = screen.getAllByRole('combobox')

  const lastOption = endPage.options[mockDocumentPagesQuantity - 1]

  await userEvent.selectOptions(
    endPage,
    lastOption,
  )

  expect(mockOnChangeEndPage).nthCalledWith(1, lastOption.value)
})

test('should show error message if page range is incorrect', async () => {
  render(
    <PageRangeSelectors
      documentPages={mockDocumentPages}
      isPageRangeValid={false}
      onChangeEndPage={jest.fn()}
      onChangeStartPage={jest.fn()}
      pageRange={['2', '3']}
    />,
  )

  expect(await screen.findByText(localize(Localization.PAGE_RANGE_ERROR_MESSAGE))).toBeInTheDocument()
})

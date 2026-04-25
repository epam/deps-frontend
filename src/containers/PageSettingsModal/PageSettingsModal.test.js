
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { localize, Localization } from '@/localization/i18n'
import { Document } from '@/models/Document'
import { documentSelector } from '@/selectors/documentReviewPage'
import { render } from '@/utils/rendererRTL'
import { PageSettingsModal } from './PageSettingsModal'

const mockDocumentPagesQuantity = 4
const minPagesValue = 1

const getPreviewDocuments = () => {
  const previewDocuments = {}
  for (let i = 1; i <= mockDocumentPagesQuantity; i++) {
    previewDocuments[i] = { blobName: 'test/preview/0.png' }
  }

  return previewDocuments
}

const mockDocument = new Document({
  id: 'id',
  previewDocuments: getPreviewDocuments(),
})

const MockSelect = ({
  pageRange,
  onChangeEndPage,
  onChangeStartPage,
}) => {
  const onChangeStartPageHandler = (e) => {
    onChangeStartPage(e.target.value)
  }

  const onChangeEndPageHandler = (e) => {
    onChangeEndPage(e.target.value)
  }

  return (
    <div data-testid='page-range-selectors'>
      <input
        name={'start-page'}
        onChange={onChangeStartPageHandler}
        value={pageRange[0]}
      />
      <input
        name={'end-page'}
        onChange={onChangeEndPageHandler}
        value={pageRange[1]}
      />
    </div>
  )
}

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/selectors/documentReviewPage', () => ({
  documentSelector: jest.fn(() => mockDocument),
}))

jest.mock('@/components/Icons/SettingsIcon', () => ({
  SettingsIcon: () => <div data-testid='settings-icon' />,
}))
jest.mock('./PageRangeSelectors', () => ({
  PageRangeSelectors: (props) => <MockSelect {...props} />,
}))

const mockRenderTrigger = (onClick) => (
  <button
    data-testid={'trigger'}
    onClick={onClick}
  />
)

const toggleModal = async () => {
  const triggerButton = screen.getByTestId('trigger')

  await userEvent.click(triggerButton)
}

const setInputValue = async (input, value) => {
  await userEvent.clear(input)
  await userEvent.type(input, value)
}

test('renders trigger component', async () => {
  render(
    <PageSettingsModal
      activePageRange={[]}
      onPageRangeChange={jest.fn()}
      renderTrigger={mockRenderTrigger}
    />,
  )

  expect(screen.getByTestId('trigger')).toBeInTheDocument()
})

test('should call documentSelector while component is rendering', async () => {
  render(
    <PageSettingsModal
      activePageRange={[]}
      onPageRangeChange={jest.fn()}
      renderTrigger={mockRenderTrigger}
    />,
  )

  expect(documentSelector).toHaveBeenCalled()
})

test('show Page Settings modal with all layouts in case modal is toggled on', async () => {
  render(
    <PageSettingsModal
      activePageRange={[]}
      onPageRangeChange={jest.fn()}
      renderTrigger={mockRenderTrigger}
    />,
  )

  await toggleModal()

  expect(screen.getByRole('heading', {
    name: localize(Localization.PAGE_RANGE),
  })).toBeInTheDocument()
  expect(await screen.findByText(localize(Localization.PAGE_RANGE_TITLE_DESCRIPTION))).toBeInTheDocument()
  expect(screen.getByTestId('page-range-selectors')).toBeInTheDocument()
})

test('should disable Submit button in case modal is toggled on', async () => {
  render(
    <PageSettingsModal
      activePageRange={[]}
      onPageRangeChange={jest.fn()}
      renderTrigger={mockRenderTrigger}
    />,
  )

  await toggleModal()

  const submitButton = screen.getByRole('button', {
    name: localize(Localization.SUBMIT),
  })

  expect(submitButton).toBeDisabled()
})

test('set page range equal to activePageRange prop if activePageRange is not empty', async () => {
  const [mockStartValue, mockEndValue] = ['2', '3']

  render(
    <PageSettingsModal
      activePageRange={[mockStartValue, mockEndValue]}
      onPageRangeChange={jest.fn()}
      renderTrigger={mockRenderTrigger}
    />,
  )

  await toggleModal()

  const [startPage, endPage] = screen.getAllByRole('textbox')

  expect(startPage).toHaveValue(mockStartValue)
  expect(endPage).toHaveValue(mockEndValue)
})

test('set page range from 1 to document pages quantity if activePageRange is empty', async () => {
  render(
    <PageSettingsModal
      activePageRange={[]}
      onPageRangeChange={jest.fn()}
      renderTrigger={mockRenderTrigger}
    />,
  )

  await toggleModal()

  const [startPage, endPage] = screen.getAllByRole('textbox')

  expect(startPage).toHaveValue(`${minPagesValue}`)
  expect(endPage).toHaveValue(`${mockDocumentPagesQuantity}`)
})

test('call onPageRangeChange with empty range if Reset button was clicked', async () => {
  const mockPageRangeChange = jest.fn()

  render(
    <PageSettingsModal
      activePageRange={['2', '3']}
      onPageRangeChange={mockPageRangeChange}
      renderTrigger={mockRenderTrigger}
    />,
  )

  await toggleModal()

  const resetButton = screen.getByRole('button', {
    name: localize(Localization.RESET),
  })
  await userEvent.click(resetButton)

  expect(mockPageRangeChange).nthCalledWith(1, [])
})

test('should disable Submit button if Reset button was clicked', async () => {
  const mockPageRangeChange = jest.fn()
  const newStartValue = '1'

  render(
    <PageSettingsModal
      activePageRange={['2', '3']}
      onPageRangeChange={mockPageRangeChange}
      renderTrigger={mockRenderTrigger}
    />,
  )

  await toggleModal()

  const [startPage] = screen.getAllByRole('textbox')
  await setInputValue(startPage, newStartValue)

  const submitButton = screen.getByRole('button', {
    name: localize(Localization.SUBMIT),
  })

  expect(submitButton).not.toBeDisabled()

  const resetButton = screen.getByRole('button', {
    name: localize(Localization.RESET),
  })
  await userEvent.click(resetButton)

  expect(submitButton).toBeDisabled()
})

test('call onPageRangeChange with selected range if Submit button was clicked', async () => {
  const [newStartValue, newEndValue] = ['1', '2']
  const mockPageRangeChange = jest.fn()

  render(
    <PageSettingsModal
      activePageRange={['2', '3']}
      onPageRangeChange={mockPageRangeChange}
      renderTrigger={mockRenderTrigger}
    />,
  )

  await toggleModal()

  const [startPage, endPage] = screen.getAllByRole('textbox')
  await setInputValue(startPage, newStartValue)
  await setInputValue(endPage, newEndValue)

  const submitButton = screen.getByRole('button', {
    name: localize(Localization.SUBMIT),
  })
  await userEvent.click(submitButton)

  expect(mockPageRangeChange).nthCalledWith(1, [newStartValue, newEndValue])
})

test('should close modal and not to call onPageRangeChange in case user clicks on close icon', async () => {
  const mockPageRangeChange = jest.fn()

  render(
    <PageSettingsModal
      activePageRange={['2', '3']}
      onPageRangeChange={mockPageRangeChange}
      renderTrigger={mockRenderTrigger}
    />,
  )

  await toggleModal()

  const closeIcon = screen.getByLabelText(localize(Localization.CLOSE))
  await userEvent.click(closeIcon)

  expect(screen.queryByText(localize(Localization.PAGE_RANGE))).not.toBeInTheDocument()
  expect(mockPageRangeChange).not.toHaveBeenCalled()
})

test('should close modal and not to call onPageRangeChange in case user clicks on modal button twice', async () => {
  const mockPageRangeChange = jest.fn()

  render(
    <PageSettingsModal
      activePageRange={['2', '3']}
      onPageRangeChange={mockPageRangeChange}
      renderTrigger={mockRenderTrigger}
    />,
  )

  await toggleModal()
  await toggleModal()

  expect(screen.queryByText(localize(Localization.PAGE_RANGE))).not.toBeInTheDocument()
  expect(mockPageRangeChange).not.toHaveBeenCalled()
})

test('should disable Submit button if start value less than 1 was set', async () => {
  render(
    <PageSettingsModal
      activePageRange={['2', '3']}
      onPageRangeChange={jest.fn()}
      renderTrigger={mockRenderTrigger}
    />,
  )

  await toggleModal()

  const [startPage] = screen.getAllByRole('textbox')
  await setInputValue(startPage, `${minPagesValue - 1}`)

  const submitButton = screen.getByRole('button', {
    name: localize(Localization.SUBMIT),
  })

  expect(submitButton).toBeDisabled()
})

test('should disable Submit button if start value more than current end page value was set', async () => {
  const [mockStartPageValue, mockEndPageValue] = ['2', '3']
  render(
    <PageSettingsModal
      activePageRange={[mockStartPageValue, mockEndPageValue]}
      onPageRangeChange={jest.fn()}
      renderTrigger={mockRenderTrigger}
    />,
  )

  await toggleModal()

  const [startPage] = screen.getAllByRole('textbox')
  await setInputValue(startPage, `${+mockEndPageValue + 1}`)

  const submitButton = screen.getByRole('button', {
    name: localize(Localization.SUBMIT),
  })

  expect(submitButton).toBeDisabled()
})

test('should disable Submit button if end value more than document pages quantity was set', async () => {
  render(
    <PageSettingsModal
      activePageRange={['2', '3']}
      onPageRangeChange={jest.fn()}
      renderTrigger={mockRenderTrigger}
    />,
  )

  await toggleModal()

  const [, endPage] = screen.getAllByRole('textbox')
  await setInputValue(endPage, `${mockDocumentPagesQuantity + 1}`)

  const submitButton = screen.getByRole('button', {
    name: localize(Localization.SUBMIT),
  })

  expect(submitButton).toBeDisabled()
})

test('should call onAfterToggle in case modal is toggled', async () => {
  const mockOnAfterToggle = jest.fn()

  render(
    <PageSettingsModal
      activePageRange={[]}
      onAfterToggle={mockOnAfterToggle}
      onPageRangeChange={jest.fn()}
      renderTrigger={mockRenderTrigger}
    />,
  )

  await toggleModal()

  expect(mockOnAfterToggle).toHaveBeenCalled()
})


import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import {
  storeCurrentDocIndex,
  storePagination,
  fetchDocumentsForNavigationInfo,
} from '@/actions/documentNavigationInfo'
import { goTo } from '@/actions/navigation'
import { PaginationKeys } from '@/constants/navigation'
import { Localization, localize } from '@/localization/i18n'
import { documentNavigationInfoSelector } from '@/selectors/documentNavigationInfo'
import { isDocumentDataFetchingSelector } from '@/selectors/requests'
import { navigationMap } from '@/utils/navigationMap'
import { render } from '@/utils/rendererRTL'
import { DocumentNavigationButton } from './DocumentNavigationButton'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('react-redux', () => ({
  ...mockReactRedux,
  useDispatch: jest.fn(() => mockDispatch),
}))

jest.mock('@/actions/documentNavigationInfo', () => ({
  storeCurrentDocIndex: jest.fn(),
  storePagination: jest.fn(),
  fetchDocumentsForNavigationInfo: jest.fn(() => Promise.resolve(mockFetchedDocumentIds)),
}))

jest.mock('@/actions/navigation', () => ({
  goTo: jest.fn(),
}))

jest.mock('@/selectors/documentNavigationInfo', () => ({
  documentNavigationInfoSelector: jest.fn(),
}))

jest.mock('@/selectors/requests', () => ({
  isDocumentDataFetchingSelector: jest.fn(),
}))

jest.mock('@/components/Icons/CaretDownIcon', () => ({
  CaretDownIcon: () => <span data-testid="caret-down-icon" />,
}))

jest.mock('@/components/Icons/CaretUpIcon', () => ({
  CaretUpIcon: () => <span data-testid="caret-up-icon" />,
}))

const mockDispatch = jest.fn((action) => action)

const documentIds = ['id1', 'id2', 'id3', 'id4', 'id5']
const mockFetchedDocumentIds = ['id6', 'id7', 'id8', 'id9', 'id10']
const pagination = {
  [PaginationKeys.PAGE]: 2,
  [PaginationKeys.PER_PAGE]: 5,
}

const mockDocumentsNavigation = {
  documentIds,
  currentDocIndex: 1,
  pagination,
  total: 15,
}

beforeEach(() => {
  jest.clearAllMocks()
  documentNavigationInfoSelector.mockReturnValue(mockDocumentsNavigation)
})

test('shows correct layout', () => {
  render(<DocumentNavigationButton />)

  expect(screen.getAllByRole('button')).toHaveLength(2)
  expect(screen.getByTestId('caret-down-icon')).toBeInTheDocument()
  expect(screen.getByTestId('caret-up-icon')).toBeInTheDocument()
})

test('disables Next button if current document is the last in documents list', () => {
  documentNavigationInfoSelector.mockReturnValueOnce({
    ...mockDocumentsNavigation,
    currentDocIndex: documentIds.length - 1,
    total: documentIds.length,
    pagination: {
      ...pagination,
      [PaginationKeys.PAGE]: 1,
    },
  })

  render(<DocumentNavigationButton />)

  const [prevButton, nextButton] = screen.getAllByRole('button')
  expect(nextButton).toBeDisabled()
  expect(prevButton).not.toBeDisabled()
})

test('disables Previous button if current document is the first in documents list', () => {
  documentNavigationInfoSelector.mockReturnValueOnce({
    ...mockDocumentsNavigation,
    currentDocIndex: 0,
    total: documentIds.length,
    pagination: {
      ...pagination,
      [PaginationKeys.PAGE]: 1,
    },
  })

  render(<DocumentNavigationButton />)

  const [prevButton, nextButton] = screen.getAllByRole('button')
  expect(prevButton).toBeDisabled()
  expect(nextButton).not.toBeDisabled()
})

test('disables Next and Previous button if document is not an item of documents list', () => {
  documentNavigationInfoSelector.mockReturnValueOnce({
    ...mockDocumentsNavigation,
    total: 0,
    currentDocIndex: undefined,
    documentIds: [],
  })

  render(<DocumentNavigationButton />)

  const [prevButton, nextButton] = screen.getAllByRole('button')
  expect(prevButton).toBeDisabled()
  expect(nextButton).toBeDisabled()
})

test('switches to next document when click on Next button', async () => {
  render(<DocumentNavigationButton />)

  const [, nextButton] = screen.getAllByRole('button')
  await userEvent.click(nextButton)

  const url = navigationMap.documents.document(documentIds[mockDocumentsNavigation.currentDocIndex + 1])

  expect(storeCurrentDocIndex).nthCalledWith(1, mockDocumentsNavigation.currentDocIndex + 1)
  expect(goTo).nthCalledWith(1, url)
})

test('switches to previous document when click on Previous button', async () => {
  render(<DocumentNavigationButton />)

  const [prevButton] = screen.getAllByRole('button')
  await userEvent.click(prevButton)

  const url = navigationMap.documents.document(documentIds[mockDocumentsNavigation.currentDocIndex - 1])

  expect(storeCurrentDocIndex).nthCalledWith(1, mockDocumentsNavigation.currentDocIndex - 1)
  expect(goTo).nthCalledWith(1, url)
})

test('fetched next page data when click on Next button if document is the last on the current page', async () => {
  documentNavigationInfoSelector.mockReturnValueOnce({
    ...mockDocumentsNavigation,
    currentDocIndex: documentIds.length - 1,
  })

  render(<DocumentNavigationButton />)

  const [, nextButton] = screen.getAllByRole('button')
  await userEvent.click(nextButton)

  expect(mockDispatch).nthCalledWith(1, fetchDocumentsForNavigationInfo())
  expect(fetchDocumentsForNavigationInfo).nthCalledWith(1, {
    ...pagination,
    [PaginationKeys.PAGE]: pagination[PaginationKeys.PAGE] + 1,
  })
})

test('switches to the first document from next page when click on Next button if document is the last on the current page', async () => {
  documentNavigationInfoSelector.mockReturnValueOnce({
    ...mockDocumentsNavigation,
    currentDocIndex: documentIds.length - 1,
  })

  render(<DocumentNavigationButton />)

  const [, nextButton] = screen.getAllByRole('button')
  await userEvent.click(nextButton)

  const url = navigationMap.documents.document(mockFetchedDocumentIds[0])

  expect(storeCurrentDocIndex).nthCalledWith(1, 0)
  expect(goTo).nthCalledWith(1, url)

  expect(storePagination).nthCalledWith(1, {
    ...pagination,
    [PaginationKeys.PAGE]: pagination[PaginationKeys.PAGE] + 1,
  })
})

test('shows notification with correct message if last document from the list has arrived', async () => {
  documentNavigationInfoSelector.mockReturnValueOnce({
    ...mockDocumentsNavigation,
    currentDocIndex: documentIds.length - 1,
  })

  fetchDocumentsForNavigationInfo.mockImplementationOnce(() => Promise.resolve([]))

  render(<DocumentNavigationButton />)

  const [, nextButton] = screen.getAllByRole('button')
  await userEvent.click(nextButton)

  expect(mockNotification.notifyInfo).nthCalledWith(
    1,
    localize(Localization.LAST_DOCUMENT_ARRIVED),
  )

  expect(storeCurrentDocIndex).not.toHaveBeenCalled()
  expect(goTo).not.toHaveBeenCalled()
  expect(storePagination).not.toHaveBeenCalled()
})

test('fetched previous page data when click on Previous button if document is the first on the current page', async () => {
  documentNavigationInfoSelector.mockReturnValueOnce({
    ...mockDocumentsNavigation,
    currentDocIndex: 0,
  })

  render(<DocumentNavigationButton />)

  const [prevButton] = screen.getAllByRole('button')
  await userEvent.click(prevButton)

  expect(mockDispatch).nthCalledWith(1, fetchDocumentsForNavigationInfo())
  expect(fetchDocumentsForNavigationInfo).nthCalledWith(1, {
    ...pagination,
    [PaginationKeys.PAGE]: pagination[PaginationKeys.PAGE] - 1,
  })
})

test('switches to the last document from previous page when click on Previous button if document is the first on the current page', async () => {
  documentNavigationInfoSelector.mockReturnValueOnce({
    ...mockDocumentsNavigation,
    currentDocIndex: 0,
  })

  render(<DocumentNavigationButton />)

  const [prevButton] = screen.getAllByRole('button')
  await userEvent.click(prevButton)

  const url = navigationMap.documents.document(mockFetchedDocumentIds[mockFetchedDocumentIds.length - 1])

  expect(storeCurrentDocIndex).nthCalledWith(1, mockFetchedDocumentIds.length - 1)
  expect(goTo).nthCalledWith(1, url)

  expect(storePagination).nthCalledWith(1, {
    ...pagination,
    [PaginationKeys.PAGE]: pagination[PaginationKeys.PAGE] - 1,
  })
})

test('shows notification with correct message if the first document from list has arrived', async () => {
  documentNavigationInfoSelector.mockReturnValueOnce({
    ...mockDocumentsNavigation,
    currentDocIndex: 0,
  })

  fetchDocumentsForNavigationInfo.mockImplementationOnce(() => Promise.resolve([]))

  render(<DocumentNavigationButton />)

  const [prevButton] = screen.getAllByRole('button')
  await userEvent.click(prevButton)

  expect(mockNotification.notifyInfo).nthCalledWith(
    1,
    localize(Localization.FIRST_DOCUMENT_ARRIVED),
  )

  expect(storeCurrentDocIndex).not.toHaveBeenCalled()
  expect(goTo).not.toHaveBeenCalled()
  expect(storePagination).not.toHaveBeenCalled()
})

test('shows notification with correct message if fetchDocumentsForNavigationInfo failed', async () => {
  documentNavigationInfoSelector.mockReturnValueOnce({
    ...mockDocumentsNavigation,
    currentDocIndex: 0,
  })

  fetchDocumentsForNavigationInfo.mockImplementationOnce(() => Promise.reject(new Error('Test error')))

  render(<DocumentNavigationButton />)

  const [prevButton] = screen.getAllByRole('button')
  await userEvent.click(prevButton)

  expect(mockNotification.notifyWarning).nthCalledWith(
    1,
    localize(Localization.DEFAULT_ERROR),
  )
})

test('shows spinner and disables navigation buttons while fetching new page data', async () => {
  let resolveCaching
  const cachingPromise = new Promise((resolve) => {
    resolveCaching = resolve
  })

  fetchDocumentsForNavigationInfo.mockImplementationOnce(() => cachingPromise)

  documentNavigationInfoSelector.mockReturnValueOnce({
    ...mockDocumentsNavigation,
    currentDocIndex: 0,
  })

  render(<DocumentNavigationButton />)

  const [prevButton] = screen.getAllByRole('button')
  await userEvent.click(prevButton)

  const [updatedPrevButton, nextButton] = screen.getAllByRole('button')

  expect(screen.getAllByTestId('spin')[1]).toHaveClass('ant-spin-spinning')
  expect(updatedPrevButton).toBeDisabled()
  expect(nextButton).toBeDisabled()

  await act(async () => {
    await resolveCaching()
  })
})

test('shows spinner and disables navigation buttons while document is fetching', async () => {
  isDocumentDataFetchingSelector.mockReturnValueOnce(true)

  render(<DocumentNavigationButton />)

  const [prevButton, nextButton] = screen.getAllByRole('button')

  expect(prevButton).toBeDisabled()
  expect(nextButton).toBeDisabled()
  expect(screen.getAllByTestId('spin')[1]).toHaveClass('ant-spin-spinning')
})

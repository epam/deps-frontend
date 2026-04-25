
import { mockEnv } from '@/mocks/mockEnv'
import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setFilters, setPagination } from '@/actions/navigation'
import {
  FileFilterKey,
  PaginationKeys,
  SortDirection,
} from '@/constants/navigation'
import { FILES_PER_PAGE } from '@/constants/storage'
import { FileStatus } from '@/enums/FileStatus'
import { Localization, localize } from '@/localization/i18n'
import { File, FileState } from '@/models/File'
import { Pagination } from '@/models/Pagination'
import { DefaultPaginationConfig } from '@/models/PaginationConfig'
import { navigationMap } from '@/utils/navigationMap'
import { render } from '@/utils/rendererRTL'
import { goTo } from '@/utils/routerActions'
import { FileDataKeyColumn } from './columns/FileDataKeyColumn'
import { FilesTable } from './FilesTable'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(() => mockDispatch),
  useSelector: jest.fn(() => []),
}))

jest.mock('@/components/Icons/SearchIcon', () => ({
  SearchIcon: () => <div data-testid={searchIconTestId} />,
}))

jest.mock('@/actions/navigation', () => ({
  setPagination: jest.fn(),
  setSelection: jest.fn(),
  setFilters: jest.fn(),
}))

const searchIconTestId = 'search-icon'
const mockDispatch = jest.fn()

const filterConfig = {
  ...DefaultPaginationConfig,
  ...Pagination.getInitialPagination(FILES_PER_PAGE),
}

const mockFile = new File({
  id: '123',
  tenantId: 'tenantId',
  name: 'file name',
  path: 'path',
  state: new FileState({
    status: FileStatus.COMPLETED,
    errorMessage: 'message',
  }),
  createdAt: '2025-07-01T00:00:00.000Z',
  updatedAt: '2025-07-01T00:00:00.000Z',
  labels: [],
})

const mockFileData = {
  meta: {
    size: 10,
    total: 100,
  },
  result: [mockFile],
}

const defaultProps = {
  filterConfig,
  isLoading: false,
  data: mockFileData,
}

test('renders table with files correctly', () => {
  render(<FilesTable {...defaultProps} />)

  const columns = screen.getAllByRole('columnheader')

  const [
    ,
    fileNameColumn,
    fileStateColumn,
    fileReferenceColumn,
    fileLabelsColumn,
    fileDateColumn,
  ] = columns

  expect(screen.getByText(mockFile.name)).toBeInTheDocument()
  expect(columns).toHaveLength(7)
  expect(fileNameColumn).toHaveTextContent(localize(Localization.TITLE))
  expect(fileStateColumn).toHaveTextContent(localize(Localization.STATE))
  expect(fileReferenceColumn).toHaveTextContent(localize(Localization.REFERENCE))
  expect(fileLabelsColumn).toHaveTextContent(localize(Localization.LABELS))
  expect(fileDateColumn).toHaveTextContent(localize(Localization.CREATION_DATE))
})

test('calls dispatch with correct arguments when change page', async () => {
  render(<FilesTable {...defaultProps} />)

  const lastPage = (
    mockFileData.meta.total / DefaultPaginationConfig[PaginationKeys.PER_PAGE]
  )

  const pageBtn = screen.getByText(lastPage)

  await userEvent.click(pageBtn)

  expect(mockDispatch).nthCalledWith(
    1,
    setPagination({
      [PaginationKeys.PAGE]: lastPage,
      [PaginationKeys.PER_PAGE]: DefaultPaginationConfig[PaginationKeys.PER_PAGE],
    }),
  )
})

test('calls setFilters with correct arguments on table sort', async () => {
  render(<FilesTable {...defaultProps} />)

  const sortUpButtons = screen.getAllByLabelText('caret-up')
  const sortFields = [
    FileDataKeyColumn.NAME,
    FileDataKeyColumn.STATE,
    FileDataKeyColumn.CREATED_AT,
  ]

  sortUpButtons.forEach((sortButton, i) => {
    jest.clearAllMocks()

    fireEvent.click(sortButton)

    expect(setFilters).nthCalledWith(1,
      {
        [FileFilterKey.SORT_ORDER]: SortDirection.ASC,
        [FileFilterKey.SORT_BY]: sortFields[i],
        [PaginationKeys.PAGE]: DefaultPaginationConfig[PaginationKeys.PAGE],
        [PaginationKeys.PER_PAGE]: DefaultPaginationConfig[PaginationKeys.PER_PAGE],
        [FileFilterKey.LABELS]: '',
        [FileFilterKey.NAME]: '',
        [FileFilterKey.STATE]: [],
        [FileFilterKey.REFERENCE]: '',
        [FileFilterKey.DATE_END]: '',
        [FileFilterKey.DATE_START]: '',
      },
    )
  })
})

test('calls goTo with correct file path', async () => {
  render(<FilesTable {...defaultProps} />)

  const navigationFilePath = navigationMap.files.file(mockFile.id)

  const fileName = screen.getByText(mockFile.name)

  await userEvent.click(fileName)

  expect(mockDispatch).toHaveBeenCalledWith(goTo(navigationFilePath))
})

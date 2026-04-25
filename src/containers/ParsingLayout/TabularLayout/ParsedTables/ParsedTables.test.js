
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen, waitFor } from '@testing-library/dom'
import { waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { getTabularLayout } from '@/api/parsingApi'
import { KnownTabularLayoutParsingType } from '@/enums/KnownTabularLayoutParsingType'
import { Localization, localize } from '@/localization/i18n'
import { TableInfo, SheetInfo } from '@/models/DocumentParsingInfo'
import { TabularLayout, Table, TableCoordinate, TableSchema } from '@/models/TabularLayout'
import { TableCell } from '@/models/TabularLayout/TableCell'
import { documentSelector } from '@/selectors/documentReviewPage'
import { notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { TabularLayoutRequestConfig } from '../TabularLayoutRequestConfig'
import { ParsedTables } from './ParsedTables'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({ documentId: 'mock-document-id' })),
}))
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/api/parsingApi', () => ({
  getTabularLayout: jest.fn(() => Promise.resolve(mockTabularLayout)),
}))

const tableFieldTestId = 'table-field'
jest.mock('../TableField', () => ({
  TableField: () => <div data-testid={tableFieldTestId} />,
}))

const mockTableInfo = new TableInfo({
  id: 'mockId',
  rowCount: 1,
  columnCount: 1,
})

const mockSheetInfo = new SheetInfo({
  id: 'mockSheetId',
  title: 'Mock Title',
  isHidden: false,
  tables: [mockTableInfo],
  images: [],
})

const mockTabularLayoutTable = new Table({
  schema: new TableSchema({
    id: 'mockTableSchemaId',
    sheetId: mockSheetInfo.id,
    rowCount: 1,
    columnCount: 1,
    placement: [
      new TableCoordinate({
        row: 0,
        column: 0,
      }),
      new TableCoordinate({
        row: 3,
        column: 7,
      }),
    ],
  }),
  data: new TableCell(
    {
      id: 'mockCellId',
      tableId: 'mockTableId',
      content: 'Mock Content',
      absolutePosition: [0, 0],
      relativePosition: [0, 0],
    }),
})

const mockTabularLayout = new TabularLayout({
  id: 'mockLayoutId',
  tenantId: 'mockTenantId',
  parsingType: KnownTabularLayoutParsingType.EXCEL,
  sheets: [{
    [mockSheetInfo.id]: mockSheetInfo,
  }],
  tables: [{
    [mockTabularLayoutTable.schema.id]: mockTabularLayoutTable,
  }],
})

test('gets tabular layout on component mount', async () => {
  const document = documentSelector.getSelectorMockValue()
  const requestConfig = new TabularLayoutRequestConfig({
    tables: [mockTableInfo.id],
    rowSpan: [0, 38],
    colSpan: [0, 40],
  })

  render(
    <ParsedTables
      activeSheetId={mockSheetInfo.id}
      sheetsInfo={[mockSheetInfo]}
      tablesInfo={mockSheetInfo.tables}
    />,
  )

  await waitFor(() => {
    expect(getTabularLayout).toHaveBeenCalledTimes(
      1,
      document._id,
      requestConfig,
    )
  })
})

test('shows correct warning notification if tabular layout fetch failed', async () => {
  const mockError = new Error('Mock Error Message')
  getTabularLayout.mockImplementationOnce(() => Promise.reject(mockError))

  render(
    <ParsedTables
      activeSheetId={mockSheetInfo.id}
      sheetsInfo={[mockSheetInfo]}
      tablesInfo={mockSheetInfo.tables}
    />,
  )

  await waitFor(() => {
    expect(notifyWarning).nthCalledWith(1, localize(Localization.DEFAULT_ERROR))
  })
})

test('shows spinner when data is fetching', async () => {
  render(
    <ParsedTables
      activeSheetId={mockSheetInfo.id}
      sheetsInfo={[mockSheetInfo]}
      tablesInfo={mockSheetInfo.tables}
    />,
  )

  await waitFor(() => {
    expect(screen.getByTestId('spin')).toBeInTheDocument()
  })
})

test('shows correct number of fetched tables', async () => {
  jest.clearAllMocks()

  render(
    <ParsedTables
      activeSheetId={mockSheetInfo.id}
      sheetsInfo={[mockSheetInfo]}
      tablesInfo={mockSheetInfo.tables}
    />,
  )

  await waitForElementToBeRemoved(screen.queryByTestId('spin'))

  const fields = screen.getAllByTestId(tableFieldTestId)

  expect(fields.length).toBe(mockSheetInfo.tables.length)
})

test('fetches more data on button click if there are tables left to fetch', async () => {
  const requestConfig = new TabularLayoutRequestConfig({
    tables: [mockTableInfo.id],
    rowSpan: [0, 38],
    colSpan: [0, 40],
  })

  render(
    <ParsedTables
      activeSheetId={mockSheetInfo.id}
      sheetsInfo={[mockSheetInfo]}
      tablesInfo={mockSheetInfo.tables}
    />,
  )

  await waitForElementToBeRemoved(screen.queryByTestId('spin'))

  jest.clearAllMocks()

  const loadMoreButton = screen.getByRole('button', {
    name: localize(Localization.LOAD_MORE),
  })

  await userEvent.click(loadMoreButton)

  expect(getTabularLayout).toHaveBeenCalledTimes(
    1,
    document._id,
    requestConfig,
  )
})

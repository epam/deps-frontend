
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen, createEvent } from '@testing-library/dom'
import { fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { KeyCode } from '@/enums/KeyCode'
import { Localization, localize } from '@/localization/i18n'
import { TableCellLayout, TableLayout } from '@/models/DocumentLayout'
import { Point } from '@/models/Point'
import { PrototypeTableHeader, TableHeaderType } from '@/models/PrototypeTableField'
import { activeTableSelector } from '@/selectors/prototypePage'
import { render } from '@/utils/rendererRTL'
import { TableHeadersSection } from './TableHeadersSection'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/components/Icons/TrashIcon', () => mockShallowComponent('TrashIcon'))
jest.mock('@/selectors/prototypePage')
jest.mock('uuid', () => ({
  v4: jest.fn(() => mockUuid),
}))

jest.mock('react-hook-form', () => ({
  ...mockReactHookForm,
  useWatch: jest.fn(() => [{
    name: 'Name 1',
    aliases: ['Name 1'],
  }, {
    name: 'Name 2',
    aliases: ['Name 2'],
  }]),
  useFormContext: jest.fn(() => ({
    formState: {
      errors: {},
    },
  })),
}))

const mockUuid = 'mock-uuid'

const mockCell1 = new TableCellLayout({
  content: 'Cell Content 1',
  kind: 'kind',
  columnIndex: 0,
  columnSpan: 1,
  rowIndex: 0,
  rowSpan: 1,
  page: 1,
  polygon: [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
})

const mockCell2 = new TableCellLayout({
  content: 'Cell Content 2',
  kind: 'kind',
  columnIndex: 0,
  columnSpan: 1,
  rowIndex: 1,
  rowSpan: 1,
  page: 1,
  polygon: [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
})

const mockTableLayout = new TableLayout({
  id: 'tableId',
  order: 1,
  cells: [mockCell1, mockCell2],
  confidence: 0,
  columnCount: 1,
  rowCount: 1,
  polygon: [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
})

beforeEach(() => {
  jest.clearAllMocks()
})

test('shows correct layout when there are no fields', () => {
  render(
    <TableHeadersSection
      addHeaders={jest.fn()}
      headerType={TableHeaderType.COLUMNS}
      headersList={[]}
      moveHeader={jest.fn()}
      removeHeader={jest.fn()}
    />,
  )
  const addColumnButton = screen.getByRole('button', { name: localize(Localization.ADD_NEW_COLUMN) })
  const addAllColumnsButton = screen.getByRole('button', { name: localize(Localization.ADD_ALL_COLUMNS) })
  const emptyDataContent = screen.getByText(localize(Localization.EMPTY_SECTION_DISCLAIMER))

  expect(emptyDataContent).toBeInTheDocument()
  expect(addColumnButton).toBeInTheDocument()
  expect(addAllColumnsButton).toBeInTheDocument()
})

test('shows correct layout when there is added field', async () => {
  const mockFields = [{
    aliases: [''],
    name: '',
    id: 'id',
  }]

  render(
    <TableHeadersSection
      addHeaders={jest.fn()}
      headerType={TableHeaderType.COLUMNS}
      headersList={mockFields}
      moveHeader={jest.fn()}
      removeHeader={jest.fn()}
    />,
  )

  const enterHeaderNameField = screen.getByPlaceholderText(localize(Localization.EMPTY_NAME))
  const enterHeaderAliasField = screen.getByRole('combobox')
  const addColumnButton = screen.getByRole('button', { name: localize(Localization.ADD_NEW_COLUMN) })
  const addAllColumnsButton = screen.getByRole('button', { name: localize(Localization.ADD_ALL_COLUMNS) })

  expect(enterHeaderNameField).toBeInTheDocument()
  expect(enterHeaderAliasField).toBeInTheDocument()
  expect(addColumnButton).toBeInTheDocument()
  expect(addAllColumnsButton).toBeInTheDocument()
})

test('shows correct button titles if headerType is rows', async () => {
  render(
    <TableHeadersSection
      addHeaders={jest.fn()}
      headerType={TableHeaderType.ROWS}
      headersList={[]}
      moveHeader={jest.fn()}
      removeHeader={jest.fn()}
    />,
  )

  const addRowButton = screen.getByRole('button', { name: localize(Localization.ADD_NEW_ROW) })
  const addAllRowsButton = screen.getByRole('button', { name: localize(Localization.ADD_ALL_ROWS) })

  expect(addRowButton).toBeInTheDocument()
  expect(addAllRowsButton).toBeInTheDocument()
})

test('calls addHeaders when clicking the "add new" button', async () => {
  const mockAddHeaders = jest.fn()

  render(
    <TableHeadersSection
      addHeaders={mockAddHeaders}
      headerType={TableHeaderType.COLUMNS}
      headersList={[]}
      moveHeader={jest.fn()}
      removeHeader={jest.fn()}
    />,
  )

  const addHeaderButton = screen.getByRole('button', {
    name: localize(Localization.ADD_NEW_COLUMN),
  })

  await userEvent.click(addHeaderButton)

  expect(mockAddHeaders).nthCalledWith(1,
    [
      new PrototypeTableHeader({
        name: '',
        aliases: [''],
      }),
    ],
  )
})

test('calls removeHeader when clicking on remove field icon', async () => {
  const mockRemoveHeader = jest.fn()
  const mockFields = [{
    aliases: [''],
    name: '',
    id: 'id',
  }]

  render(
    <TableHeadersSection
      addHeaders={jest.fn()}
      headerType={TableHeaderType.COLUMNS}
      headersList={mockFields}
      moveHeader={jest.fn()}
      removeHeader={mockRemoveHeader}
    />,
  )

  const removeIcon = screen.getByTestId('TrashIcon')

  await userEvent.click(removeIcon)

  expect(mockRemoveHeader).toHaveBeenCalled()
})

test('calls addHeaders with correct data when clicking on the "Add All Columns" button', async () => {
  const mockAddHeaders = jest.fn()

  activeTableSelector.mockReturnValue(mockTableLayout)

  render(
    <TableHeadersSection
      addHeaders={mockAddHeaders}
      headerType={TableHeaderType.COLUMNS}
      headersList={[]}
      moveHeader={jest.fn()}
      removeHeader={jest.fn()}
    />,
  )

  const addAllHeadersButton = screen.getByRole('button', {
    name: localize(Localization.ADD_ALL_COLUMNS),
  })

  await userEvent.click(addAllHeadersButton)

  expect(mockAddHeaders).nthCalledWith(1,
    [{
      id: `${mockUuid}_col_${mockCell1.columnIndex}_row_${mockCell1.rowIndex}`,
      ...new PrototypeTableHeader({
        name: mockCell1.content,
        aliases: [mockCell1.content],
      }),
    }],
    { shouldFocus: false },
  )
})

test('calls addHeaders with correct data when clicking on the "Add All Rows" button', async () => {
  const mockAddHeaders = jest.fn()

  activeTableSelector.mockReturnValue(mockTableLayout)

  render(
    <TableHeadersSection
      addHeaders={mockAddHeaders}
      headerType={TableHeaderType.ROWS}
      headersList={[]}
      moveHeader={jest.fn()}
      removeHeader={jest.fn()}
    />,
  )

  const addAllHeadersButton = screen.getByRole('button', {
    name: localize(Localization.ADD_ALL_ROWS),
  })

  await userEvent.click(addAllHeadersButton)

  expect(mockAddHeaders).nthCalledWith(1,
    [{
      id: `${mockUuid}_col_${mockCell1.columnIndex}_row_${mockCell1.rowIndex}`,
      ...new PrototypeTableHeader({
        name: mockCell1.content,
        aliases: [mockCell1.content],
      }),
    },
    {
      id: `${mockUuid}_col_${mockCell2.columnIndex}_row_${mockCell2.rowIndex}`,
      ...new PrototypeTableHeader({
        name: mockCell2.content,
        aliases: [mockCell2.content],
      }),
    }],
    { shouldFocus: false },
  )
})

test('calls moveHeader when user sets order of headers by dragging', async () => {
  const mockMoveHeader = jest.fn()
  const mockFields = [{
    id: 'id1',
    aliases: ['test1'],
    name: 'test1',
  },
  {
    id: 'id2',
    aliases: ['test2'],
    name: 'test2',
  }]

  render(
    <TableHeadersSection
      addHeaders={jest.fn()}
      headerType={TableHeaderType.COLUMNS}
      headersList={mockFields}
      moveHeader={mockMoveHeader}
      removeHeader={jest.fn()}
    />,
  )

  const [firstHeaderIcon, secondHeaderIcon] = screen.getAllByLabelText('menu')

  fireEvent.mouseDown(firstHeaderIcon)
  fireEvent.dragStart(firstHeaderIcon)
  fireEvent.dragEnter(secondHeaderIcon)
  fireEvent.dragOver(secondHeaderIcon)
  fireEvent.drop(secondHeaderIcon)

  expect(mockMoveHeader).toHaveBeenCalled()
})

test('prevents Backspace default when only one alias exists and no text in the input', () => {
  const mockFields = [{
    id: 'id1',
    aliases: ['Alias 1'],
    name: 'Header 1',
  }]

  render(
    <TableHeadersSection
      addHeaders={jest.fn()}
      headerType={TableHeaderType.COLUMNS}
      headersList={mockFields}
      moveHeader={jest.fn()}
      removeHeader={jest.fn()}
    />,
  )

  const aliasInput = screen.getByRole('combobox')
  const stopPropagationSpy = jest.spyOn(Event.prototype, 'stopPropagation')
  const event = createEvent.keyDown(aliasInput, {
    keyCode: KeyCode.BACKSPACE,
    target: { value: '' },
  })

  fireEvent(aliasInput, event)

  expect(event.defaultPrevented).toBe(true)
  expect(stopPropagationSpy).toHaveBeenCalled()
  stopPropagationSpy.mockRestore()
})

test('allows Backspace when only one alias exists and input has text', () => {
  const mockFields = [{
    id: 'id1',
    aliases: ['Alias 1'],
    name: 'Header 1',
  }]

  render(
    <TableHeadersSection
      addHeaders={jest.fn()}
      headerType={TableHeaderType.COLUMNS}
      headersList={mockFields}
      moveHeader={jest.fn()}
      removeHeader={jest.fn()}
    />,
  )

  const aliasInput = screen.getByRole('combobox')
  const stopPropagationSpy = jest.spyOn(Event.prototype, 'stopPropagation')
  const event = createEvent.keyDown(aliasInput, {
    keyCode: KeyCode.BACKSPACE,
    target: { value: 'text' },
  })

  fireEvent(aliasInput, event)

  expect(event.defaultPrevented).toBe(false)
  expect(stopPropagationSpy).not.toHaveBeenCalled()
  stopPropagationSpy.mockRestore()
})

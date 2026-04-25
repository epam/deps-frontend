
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/utils/rendererRTL'
import { TableHeaderCell } from './TableHeaderCell'

const renderHeader = (cell) => render(
  <table>
    <thead>
      <tr>
        {cell}
      </tr>
    </thead>
  </table>,
)

jest.mock('@/utils/env', () => mockEnv)

test('click on header cell is suppressed while resizing', async () => {
  const onClick = jest.fn()

  renderHeader(
    <TableHeaderCell
      isResizing
      onClick={onClick}
      onResize={jest.fn()}
      onResizeStart={jest.fn()}
      onResizeStop={jest.fn()}
      resizableWidth={120}
    >
      Title
    </TableHeaderCell>,
  )

  const user = userEvent.setup()
  await user.click(screen.getByRole('columnheader', { name: 'Title' }))
  expect(onClick).not.toHaveBeenCalled()
})

test('click on header cell goes through when not resizing', async () => {
  const onClick = jest.fn()

  renderHeader(
    <TableHeaderCell
      isResizing={false}
      onClick={onClick}
      onResize={jest.fn()}
      onResizeStart={jest.fn()}
      onResizeStop={jest.fn()}
      resizableWidth={120}
    >
      Name
    </TableHeaderCell>,
  )

  const user = userEvent.setup()
  await user.click(screen.getByRole('columnheader', { name: 'Name' }))
  expect(onClick).toHaveBeenCalled()
})

test('renders th without handle when onResize is not provided', () => {
  renderHeader(
    <TableHeaderCell
      onClick={jest.fn()}
      resizableWidth={120}
    >
      Plain
    </TableHeaderCell>,
  )

  expect(screen.queryByTestId('resizable-handle')).toBeNull()
})

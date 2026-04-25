
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event'
import { MenuItem, SubMenu } from '@/components/Menu/CustomMenu'
import { render } from '@/utils/rendererRTL'
import { ActionsMenu } from './ActionsMenu'

jest.mock('@/utils/env', () => mockEnv)

const mockOption1 = 'Option 1'
const mockOption2 = 'Option 2'
const mockSubMenu = 'Sub Menu Title'
const mockSubMenuOption1 = 'Sub Menu Option 1'
const mockSubMenuOption2 = 'Sub Menu Option 2'

const mockMenuItems = [
  new MenuItem({
    content: () => <div key="option1">{mockOption1}</div>,
    disabled: false,
  }),
  new MenuItem({
    content: () => <div key="option2">{mockOption2}</div>,
    disabled: true,
  }),
]

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

test('disables action menu button if disabled prop is true', () => {
  render(
    <ActionsMenu
      disabled={true}
      items={mockMenuItems}
    />,
  )

  expect(screen.getByRole('button')).toBeDisabled()
})

test('renders action menu with passed menu items if user clicks button', async () => {
  render(
    <ActionsMenu
      disabled={false}
      items={mockMenuItems}
    />,
  )

  const button = screen.getByRole('button')
  await user.click(button)

  expect(screen.getByRole('menu')).toBeInTheDocument()
  expect(screen.getByText(mockOption1)).toBeInTheDocument()
  expect(screen.getByText(mockOption1)).toBeInTheDocument()
})

test('renders sub menu with passed sub menu items', async () => {
  const mockMenuItems = [
    new SubMenu({
      key: 'subMenuKey',
      title: mockSubMenu,
      children: [
        new MenuItem({
          content: () => <div key="subMenuOption1">{mockSubMenuOption1}</div>,
          disabled: false,
        }),
        new MenuItem({
          content: () => <div key="subMenuOption2">{mockSubMenuOption2}</div>,
          disabled: true,
        }),
      ],
    }),
  ]

  render(
    <ActionsMenu
      disabled={false}
      items={mockMenuItems}
    />,
  )

  const button = screen.getByRole('button')
  await user.click(button)

  const subMenu = screen.getByText(mockSubMenu)
  await user.click(subMenu, {
    pointerEventsCheck: PointerEventsCheckLevel.Never,
  })

  await waitFor(() => {
    expect(screen.getByText(mockSubMenuOption1)).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.getByText(mockSubMenuOption2)).toBeInTheDocument()
  })
})

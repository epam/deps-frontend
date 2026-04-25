
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { render } from '@/utils/rendererRTL'
import { FileImagePageSwitcher } from './FileImagePageSwitcher'

jest.mock('@/utils/env', () => mockEnv)

let defaultProps

beforeEach(() => {
  jest.clearAllMocks()
  defaultProps = {
    activePage: 1,
    onChangeActivePage: jest.fn(),
    pagesQuantity: 5,
    disabled: false,
  }
})

test('renders page switcher with combobox', () => {
  render(<FileImagePageSwitcher {...defaultProps} />)

  const combobox = screen.getByRole('combobox')
  expect(combobox).toBeInTheDocument()
  expect(screen.getByText('5')).toBeInTheDocument()
})

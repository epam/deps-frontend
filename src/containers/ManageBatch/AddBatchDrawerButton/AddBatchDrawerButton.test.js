
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { AddBatchDrawerButton } from './AddBatchDrawerButton'

jest.mock('@/utils/env', () => mockEnv)

const mockDispatch = jest.fn()

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}))

jest.mock('../AddBatchDrawer', () => mockComponent('AddBatchDrawer'))

const TEST_ID = {
  ADD_BUTTON: 'add-batch-drawer-add-button',
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders Add button with correct text', () => {
  render(<AddBatchDrawerButton />)

  expect(screen.getByTestId(TEST_ID.ADD_BUTTON)).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.ADD_NEW_BATCH))).toBeInTheDocument()
})

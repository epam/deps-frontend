
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { localize, Localization } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { FieldsEmptyState } from './FieldsEmptyState'

var MockAddFieldDrawer

jest.mock('@/utils/env', () => mockEnv)
jest.mock('../AddFieldDrawer', () => {
  const mock = mockShallowComponent('AddFieldDrawer')
  MockAddFieldDrawer = mock.AddFieldDrawer
  return mock
})

let defaultProps

beforeEach(() => {
  jest.clearAllMocks()

  defaultProps = {
    add: jest.fn(),
    defaultExtractorId: 'mock-extractor-id',
  }
})

test('renders empty state text', () => {
  render(<FieldsEmptyState {...defaultProps} />)

  const emptyStateText = screen.getByText(localize(Localization.NO_ITEMS_MESSAGE))

  expect(emptyStateText).toBeInTheDocument()
})

test('renders AddFieldDrawer component', () => {
  render(<FieldsEmptyState {...defaultProps} />)

  const addFieldDrawer = screen.getByTestId('AddFieldDrawer')

  expect(addFieldDrawer).toBeInTheDocument()
})

test('passes add prop to AddFieldDrawer', () => {
  render(<FieldsEmptyState {...defaultProps} />)

  const props = MockAddFieldDrawer.getProps()

  expect(props.add).toBe(defaultProps.add)
})

test('passes defaultExtractorId prop to AddFieldDrawer', () => {
  render(<FieldsEmptyState {...defaultProps} />)

  const props = MockAddFieldDrawer.getProps()

  expect(props.defaultExtractorId).toBe(defaultProps.defaultExtractorId)
})

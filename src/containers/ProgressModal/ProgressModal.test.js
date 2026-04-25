
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { ProgressModal } from './ProgressModal'

jest.mock('@/utils/env', () => mockEnv)

const PROGRESS_TEST_ID = 'progress-id'
const defaultProps = {
  current: 5,
  total: 10,
}

test('renders modal with correct default title', () => {
  render(<ProgressModal {...defaultProps} />)

  expect(screen.getByText(localize(Localization.UPLOAD_FILES))).toBeInTheDocument()
})

test('renders modal with passed title', () => {
  const props = {
    ...defaultProps,
    title: 'Test Title',
  }
  render(<ProgressModal {...props} />)

  expect(screen.getByText(props.title)).toBeInTheDocument()
})

test('shows correct progress percentage', () => {
  render(<ProgressModal {...defaultProps} />)

  expect(screen.getByText(`${defaultProps.current / defaultProps.total * 100}%`)).toBeInTheDocument()
})

test('shows correct progress message', () => {
  render(<ProgressModal {...defaultProps} />)

  expect(screen.getByText(localize(Localization.VALUE_OF_TOTAL, {
    value: defaultProps.current,
    total: defaultProps.total,
  }))).toBeInTheDocument()
})

test('should show warning message', () => {
  render(<ProgressModal {...defaultProps} />)

  expect(screen.getByText(localize(Localization.DO_NOT_CLOSE_PAGE))).toBeInTheDocument()
})

test('should show progress bar', () => {
  render(<ProgressModal {...defaultProps} />)

  expect(screen.getByTestId(PROGRESS_TEST_ID)).toBeInTheDocument()
})

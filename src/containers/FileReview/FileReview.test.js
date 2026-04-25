
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockSessionStorageWrapper } from '@/mocks/mockSessionStorageWrapper'
import { screen } from '@testing-library/react'
import { PAGE_SEPARATOR_POSITION } from '@/constants/storage'
import { render } from '@/utils/rendererRTL'
import { sessionStorageWrapper } from '@/utils/sessionStorageWrapper'
import { FileReview } from './FileReview'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/containers/FileViewHeader', () => mockShallowComponent('FileViewHeader'))
jest.mock('@/containers/FilePreview', () => mockShallowComponent('FilePreview'))
jest.mock('@/containers/FileLayout', () => mockShallowComponent('FileLayout'))
jest.mock('@/utils/sessionStorageWrapper', () => mockSessionStorageWrapper('50%'))
jest.mock('@/containers/FilePromptCalibrationStudio', () => mockShallowComponent('FilePromptCalibrationStudio'))

const handleResizeStop = (onResizeStop) => {
  const mockRef = {
    style: {
      width: '35%',
    },
  }
  onResizeStop(null, null, mockRef)
}

const mockResizableComponent = jest.fn(({ children, defaultSize, enable, maxWidth, minWidth, onResizeStop }) => (
  <div
    data-default-height={defaultSize.height}
    data-default-width={defaultSize.width}
    data-enable-right={enable.right}
    data-max-width={maxWidth}
    data-min-width={minWidth}
    data-testid="Resizable"
  >
    {children}
    <button
      data-testid="trigger-resize-stop"
      onClick={() => handleResizeStop(onResizeStop)}
    >
      Resize Stop
    </button>
  </div>
))

jest.mock('re-resizable', () => ({
  Resizable: (...args) => mockResizableComponent(...args),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders FileViewHeader component', () => {
  render(<FileReview />)

  const fileViewHeader = screen.getByTestId('FileViewHeader')

  expect(fileViewHeader).toBeInTheDocument()
})

test('renders FilePreview component', () => {
  render(<FileReview />)

  const filePreview = screen.getByTestId('FilePreview')

  expect(filePreview).toBeInTheDocument()
})

test('renders FileLayout component', () => {
  render(<FileReview />)

  const fileLayout = screen.getByTestId('FileLayout')

  expect(fileLayout).toBeInTheDocument()
})

test('renders FilePromptCalibrationStudio component', () => {
  render(<FileReview />)

  const filePromptCalibrationStudio = screen.getByTestId('FilePromptCalibrationStudio')

  expect(filePromptCalibrationStudio).toBeInTheDocument()
})

test('calls sessionStorageWrapper.getItem on mount', () => {
  render(<FileReview />)

  expect(sessionStorageWrapper.getItem).toHaveBeenCalledWith(PAGE_SEPARATOR_POSITION)
})

test('applies size from sessionStorage to Resizable', () => {
  render(<FileReview />)

  const resizable = screen.getByTestId('Resizable')

  expect(resizable).toHaveAttribute('data-default-width', '50%')
  expect(resizable).toHaveAttribute('data-default-height', '100%')
})

test('uses default width when sessionStorage returns null', () => {
  sessionStorageWrapper.getItem.mockReturnValueOnce(null)

  render(<FileReview />)

  const resizable = screen.getByTestId('Resizable')

  expect(resizable).toHaveAttribute('data-default-width', '45%')
})

test('configures Resizable with correct constraints', () => {
  render(<FileReview />)

  const resizable = screen.getByTestId('Resizable')

  expect(resizable).toHaveAttribute('data-min-width', '500')
  expect(resizable).toHaveAttribute('data-max-width', '65%')
  expect(resizable).toHaveAttribute('data-enable-right', 'true')
})

test('calls sessionStorage.setItem with correct argument on resize stop', () => {
  jest.clearAllMocks()

  render(<FileReview />)

  const triggerButton = screen.getByTestId('trigger-resize-stop')

  triggerButton.click()

  expect(sessionStorageWrapper.setItem).toHaveBeenCalledWith(PAGE_SEPARATOR_POSITION, '35%')
})

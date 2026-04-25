
import { mockEnv } from '@/mocks/mockEnv'
import { render, screen } from '@testing-library/react'
import { FileStatus as FileStatusEnum, RESOURCE_FILE_STATUS } from '@/enums/FileStatus'
import { theme } from '@/theme/theme.default'
import { FileStatus } from './FileStatus'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('./FileStatus.styles', () => ({
  StyledBadge: ({ color, text, className }) => (
    <div
      className={className}
      data-color={color}
      data-testid="file-status-badge"
    >
      {text}
    </div>
  ),
}))

describe('FileStatus', () => {
  let defaultProps

  beforeEach(() => {
    jest.clearAllMocks()

    defaultProps = {
      status: FileStatusEnum.PROCESSING,
    }
  })

  test('renders StyledBadge component', () => {
    render(<FileStatus {...defaultProps} />)

    expect(screen.getByTestId('file-status-badge')).toBeInTheDocument()
  })

  test('renders badge with error color for FAILED status', () => {
    defaultProps.status = FileStatusEnum.FAILED

    render(<FileStatus {...defaultProps} />)

    const badge = screen.getByTestId('file-status-badge')
    expect(badge).toHaveAttribute('data-color', theme.color.error)
  })

  test('renders correct text for PROCESSING status', () => {
    defaultProps.status = FileStatusEnum.PROCESSING

    render(<FileStatus {...defaultProps} />)

    expect(screen.getByText(RESOURCE_FILE_STATUS[FileStatusEnum.PROCESSING])).toBeInTheDocument()
  })

  test('renders correct text for COMPLETED status', () => {
    defaultProps.status = FileStatusEnum.COMPLETED

    render(<FileStatus {...defaultProps} />)

    expect(screen.getByText(RESOURCE_FILE_STATUS[FileStatusEnum.COMPLETED])).toBeInTheDocument()
  })

  test('renders correct text for FAILED status', () => {
    defaultProps.status = FileStatusEnum.FAILED

    render(<FileStatus {...defaultProps} />)

    expect(screen.getByText(RESOURCE_FILE_STATUS[FileStatusEnum.FAILED])).toBeInTheDocument()
  })

  describe('all status values', () => {
    test.each(Object.values(FileStatusEnum))(
      'renders badge for %s status',
      (status) => {
        defaultProps.status = status

        render(<FileStatus {...defaultProps} />)

        const badge = screen.getByTestId('file-status-badge')
        expect(badge).toBeInTheDocument()
        expect(badge).toHaveTextContent(RESOURCE_FILE_STATUS[status])
      },
    )
  })
})

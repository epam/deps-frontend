
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FIELD_FORM_CODE } from '@/containers/UploadSplittingFilesDrawer/constants'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { FileTag } from './FileTag'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Icons/WarningTriangleIcon', () => ({
  WarningTriangleIcon: jest.fn(() => <span data-testid={mockWarningTriangleIconId} />),
}))

jest.mock('react-hook-form', () => ({
  useFormContext: jest.fn(() => ({
    setValue: mockSetFormValue,
  })),
  useWatch: jest.fn(() => [{
    uid: '123',
    name: 'file.txt',
  }]),
}))

const mockSetFormValue = jest.fn()
const mockWarningTriangleIconId = 'warning-triangle-icon'

test('renders file tag with file name', () => {
  const defaultProps = {
    file: {
      uid: '123',
      name: 'file.txt',
    },
  }

  render(<FileTag {...defaultProps} />)

  const fileName = screen.getByText(defaultProps.file.name)

  expect(fileName).toBeInTheDocument()
})

test('calls setValue when click on close icon', async () => {
  const defaultProps = {
    file: {
      uid: '123',
      name: 'file.txt',
    },
  }

  render(<FileTag {...defaultProps} />)

  const closeIcon = screen.getByTestId('close-icon')
  await userEvent.click(closeIcon)

  expect(mockSetFormValue).toHaveBeenCalledWith(FIELD_FORM_CODE.FILES, [])
})

test('renders warning icon with tooltip when file extension is not PDF', async () => {
  const defaultProps = {
    file: {
      uid: '123',
      name: 'file.jpg',
    },
  }

  render(<FileTag {...defaultProps} />)

  const warningIcon = screen.getByTestId(mockWarningTriangleIconId)
  await userEvent.hover(warningIcon)

  await waitFor(() => {
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent(localize(Localization.SPLITTING_IS_APPLICABLE_FOR_PDF))
  })
})

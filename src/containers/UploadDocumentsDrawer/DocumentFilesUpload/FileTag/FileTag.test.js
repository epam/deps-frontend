
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FIELD_FORM_CODE } from '@/containers/UploadDocumentsDrawer/constants'
import { render } from '@/utils/rendererRTL'
import { FileTag } from './FileTag'

jest.mock('@/utils/env', () => mockEnv)

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

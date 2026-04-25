
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FILE_EXTENSION_TO_DOWNLOAD_FORMAT, FileExtension } from '@/enums/FileExtension'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { OutputFormat } from './OutputFormat'

jest.mock('@/utils/env', () => mockEnv)

const mockFormat = FILE_EXTENSION_TO_DOWNLOAD_FORMAT[FileExtension.JSON]

test('show Output Format switcher with predefined output formats', () => {
  render(
    <OutputFormat
      format={mockFormat}
      updateProfile={jest.fn()}
    />,
  )

  expect(screen.getByText(localize(Localization.EXCEL))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.JSON))).toBeInTheDocument()
})

test('show passed format as checked', () => {
  render(
    <OutputFormat
      format={mockFormat}
      updateProfile={jest.fn()}
    />,
  )

  expect(screen.getByDisplayValue(mockFormat)).toBeChecked()
})

test('call updateProfile if output format was changed ', async () => {
  const mockUpdateProfile = jest.fn()

  render(
    <OutputFormat
      format={mockFormat}
      updateProfile={mockUpdateProfile}
    />,
  )

  const radio = screen.getByDisplayValue(FILE_EXTENSION_TO_DOWNLOAD_FORMAT[FileExtension.XLSX])

  await userEvent.click(radio)

  expect(mockUpdateProfile).nthCalledWith(
    1,
    expect.any(Function),
  )
})

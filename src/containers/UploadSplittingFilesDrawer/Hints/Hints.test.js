
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { FILE_EXTENSION_TO_DISPLAY_TEXT, FileExtension } from '@/enums/FileExtension'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { MAX_FILES_COUNT_FOR_ONE_BATCH } from '../constants'
import { Hints } from './Hints'

jest.mock('@/utils/env', () => mockEnv)

const FILES_FORMATS = [
  FILE_EXTENSION_TO_DISPLAY_TEXT[FileExtension.DOCX],
  FILE_EXTENSION_TO_DISPLAY_TEXT[FileExtension.XLSX],
  FILE_EXTENSION_TO_DISPLAY_TEXT[FileExtension.CSV],
]

test('renders parsing hint correctly', async () => {
  render(<Hints />)

  const content = screen.getByText(localize(Localization.FILES_HAVE_NATIVE_PARSING))
  const formats = screen.getByText(FILES_FORMATS.join('; '))

  expect(content).toBeInTheDocument()
  expect(formats).toBeInTheDocument()
})

test('renders files upload hint correctly', async () => {
  render(<Hints />)

  const content = screen.getByText(
    localize(Localization.ONE_BATCH_MAX_FILES,
      { maxFiles: MAX_FILES_COUNT_FOR_ONE_BATCH }),
  )

  expect(content).toBeInTheDocument()
})

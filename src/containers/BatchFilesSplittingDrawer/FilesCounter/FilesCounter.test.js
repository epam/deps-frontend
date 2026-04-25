
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { MAX_FILES_COUNT_FOR_ONE_BATCH } from '../constants'
import { FilesCounter } from '.'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('../hooks', () => ({
  useFilesSplitting: jest.fn(() => ({
    splittableFiles: [],
    batchFiles: batchFiles,
  })),
}))

const batchFiles = [{
  id: '1',
  name: 'batch1',
}]

test('renders FilesCounter correctly', () => {
  render(<FilesCounter />)

  const title = screen.getByText(localize(Localization.BATCH_FILES_NUMBER), { exact: false })
  const counter = screen.getByText(
    `${batchFiles.length} / ${MAX_FILES_COUNT_FOR_ONE_BATCH}`,
    { exact: false },
  )

  expect(title).toBeInTheDocument()
  expect(counter).toBeInTheDocument()
})

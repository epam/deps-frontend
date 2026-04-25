
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { SplittableFile } from '../viewModels'
import { DrawerHeader } from '.'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('../hooks', () => ({
  useFilesSplitting: jest.fn(() => ({
    splittableFiles: [mockFile],
    currentFileIndex: 0,
  })),
}))

jest.mock('../BatchInfo', () => mockComponent('BatchInfo'))

const mockFile = new SplittableFile({
  id: '1',
  source: {
    name: 'file1.pdf',
  },
  segments: [],
  batchName: 'batch1',
})

test('renders DrawerHeader correctly', () => {
  render(<DrawerHeader />)

  const title = screen.getByText(localize(Localization.ONE_BATCH_SPLITTING))
  const fileName = screen.getByText(mockFile.source.name, { exact: false })

  expect(title).toBeInTheDocument()
  expect(fileName).toBeInTheDocument()
})

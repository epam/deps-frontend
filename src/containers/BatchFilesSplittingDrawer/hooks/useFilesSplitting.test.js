
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { renderHook } from '@testing-library/react-hooks/dom'
import { FilesSplittingProvider } from '@/containers/BatchFilesSplittingDrawer/providers'
import { BatchSettings, SplittableFile } from '../viewModels'
import { useFilesSplitting } from './useFilesSplitting'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/containers/PdfSplitting', () => mockComponent('PdfSplitting'))

const mockFile = new File(['content'], 'test1.pdf', { type: 'application/pdf' })

const mockSettings = new BatchSettings({
  group: null,
  llmType: 'llmType',
  engine: 'engine',
  parsingFeatures: [],
})

test('retrieves the context value provided by FilesSplittingContext', () => {
  const wrapper = ({ children }) => (
    <FilesSplittingProvider
      files={[mockFile]}
      settings={mockSettings}
    >
      {children}
    </FilesSplittingProvider>
  )

  const { result } = renderHook(() => useFilesSplitting(), { wrapper })

  expect(result.current).toEqual({
    batchFiles: [mockFile],
    batchSettings: {
      engine: 'engine',
      group: null,
      llmType: 'llmType',
      parsingFeatures: [],
    },
    currentFileIndex: 0,
    splittableFiles: [
      new SplittableFile({
        source: mockFile,
        segments: [],
        batchName: null,
      }),
    ],
    setBatchFiles: expect.any(Function),
    setBatchSettings: expect.any(Function),
    setCurrentFileIndex: expect.any(Function),
    setSplittableFile: expect.any(Function),
  })
})

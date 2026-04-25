
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen, render } from '@testing-library/react'
import { Batch, BatchFile } from '@/models/Batch'
import { BatchesCommandBar } from './BatchesCommandBar'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/DeleteBatch', () => mockShallowComponent('DeleteSingleBatch'))

const mockBatch = new Batch({
  id: '1',
  files: [
    new BatchFile({
      documentTypeId: '2',
      error: null,
      parsingFeatures: ['text', 'tables'],
      name: 'file name',
      llmType: 'llm type',
      engine: 'engine',
      status: 'completed',
    }),
  ],
  group: {
    id: '3',
    name: 'group name',
  },
  name: 'batch name',
  status: 'completed',
  createdAt: '2025-07-01T00:00:00.000Z',
})

test('renders DeleteSingleBatch command', async () => {
  const props = {
    batch: mockBatch,
  }

  render(<BatchesCommandBar {...props} />)

  const deleteCommand = screen.getByTestId('DeleteSingleBatch')

  expect(deleteCommand).toBeInTheDocument()
})
